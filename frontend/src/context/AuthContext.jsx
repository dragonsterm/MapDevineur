import { createContext, useEffect, useState } from 'react';
import apiClient from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const fetchUser = async () => {
    try {
      const { data } = await apiClient.get('/api/user');
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (credentials) => {
    await apiClient.get('/sanctum/csrf-cookie');
    await apiClient.post('/login', credentials);
    await fetchUser();
  };

  const logout = async () => {
    try {
      await apiClient.post('/logout');
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, initializing, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}