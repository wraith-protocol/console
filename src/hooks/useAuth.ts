import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { setAccessToken } from '../api/client';
import * as authApi from '../api/auth';
import type { Developer } from '../api/auth';

interface AuthState {
  developer: Developer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function useAuthProvider(): AuthState {
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authApi
      .getMe()
      .then((dev) => {
        setDeveloper(dev);
      })
      .catch(() => {
        setDeveloper(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    setAccessToken(res.accessToken);
    setDeveloper(res.developer);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await authApi.register(name, email, password);
    setAccessToken(res.accessToken);
    setDeveloper(res.developer);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setAccessToken(null);
      setDeveloper(null);
    }
  }, []);

  return {
    developer,
    isLoading,
    isAuthenticated: !!developer,
    login,
    register,
    logout,
  };
}
