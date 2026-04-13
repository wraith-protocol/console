import { apiClient } from './client';

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  environment: 'live' | 'test';
  lastUsedAt: string | null;
  createdAt: string;
}

export interface CreateKeyResponse extends ApiKey {
  key: string;
}

export function getKeys(teamId: string) {
  return apiClient<ApiKey[]>(`/teams/${teamId}/keys`);
}

export function createKey(teamId: string, name: string, environment: 'live' | 'test') {
  return apiClient<CreateKeyResponse>(`/teams/${teamId}/keys`, {
    method: 'POST',
    body: JSON.stringify({ name, environment }),
  });
}

export function updateKey(teamId: string, keyId: string, name: string) {
  return apiClient<ApiKey>(`/teams/${teamId}/keys/${keyId}`, {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  });
}

export function revokeKey(teamId: string, keyId: string) {
  return apiClient<void>(`/teams/${teamId}/keys/${keyId}`, { method: 'DELETE' });
}
