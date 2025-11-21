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
        // Only store essential user data
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
    // Only store essential user data
    setUser({
      id: data.user.id,
      username: data.user.username,
    });
  };

  const login = async (credentials) => {
    await apiClient.get('/sanctum/csrf-cookie');
    const { data } = await apiClient.post('/login', credentials);
    // Only store essential user data
    setUser({
      id: data.user.id,
      username: data.user.username,
    });
  };

  const logout = async () => {
    await apiClient.post('/logout');
    setUser(null);
    // Clear storage on logout
    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, initializing }}>
      {children}
    </AuthContext.Provider>
  );
}