import { createContext, useState, useEffect } from 'react';
import apiClient from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await apiClient.get('/api/user');
        setUser({
          id: data.id,
          username: data.username,
        });
      } catch {
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    fetchUser();
  }, []);

  const register = async (credentials) => {
    await apiClient.get('/sanctum/csrf-cookie');
    const { data } = await apiClient.post('/register', credentials);
    setUser({
      id: data.user.id,
      username: data.user.username,
    });
  };

  const login = async (credentials) => {
    await apiClient.get('/sanctum/csrf-cookie');
    const { data } = await apiClient.post('/login', credentials);
    setUser({
      id: data.user.id,
      username: data.user.username,
    });
  };

  const logout = async () => {
    try {
      await apiClient.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      
      localStorage.clear();
      sessionStorage.clear();
      
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, initializing }}>
      {children}
    </AuthContext.Provider>
  );
}