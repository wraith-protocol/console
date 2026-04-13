import { apiClient } from './client';

export interface Developer {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

interface AuthResponse {
  accessToken: string;
  developer: Developer;
}

export function login(email: string, password: string) {
  return apiClient<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function register(name: string, email: string, password: string) {
  return apiClient<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export function logout() {
  return apiClient<void>('/auth/logout', { method: 'POST' });
}

export function getMe() {
  return apiClient<Developer>('/auth/me');
}

export function forgotPassword(email: string) {
  return apiClient<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(token: string, password: string) {
  return apiClient<{ message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
}

export function getGoogleOAuthUrl() {
  return `${import.meta.env.VITE_GATEWAY_URL || 'https://api.wraithprotocol.xyz'}/auth/google`;
}

export function getGithubOAuthUrl() {
  return `${import.meta.env.VITE_GATEWAY_URL || 'https://api.wraithprotocol.xyz'}/auth/github`;
}
