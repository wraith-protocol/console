import { apiClient } from './client';

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: string;
}

export function getWebhooks(teamId: string) {
  return apiClient<Webhook[]>(`/teams/${teamId}/webhooks`);
}

export function createWebhook(teamId: string, url: string, events: string[]) {
  return apiClient<Webhook>(`/teams/${teamId}/webhooks`, {
    method: 'POST',
    body: JSON.stringify({ url, events }),
  });
}

export function updateWebhook(
  teamId: string,
  webhookId: string,
  data: { url?: string; events?: string[]; active?: boolean },
) {
  return apiClient<Webhook>(`/teams/${teamId}/webhooks/${webhookId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteWebhook(teamId: string, webhookId: string) {
  return apiClient<void>(`/teams/${teamId}/webhooks/${webhookId}`, { method: 'DELETE' });
}

export function testWebhook(teamId: string, webhookId: string) {
  return apiClient<{ success: boolean }>(`/teams/${teamId}/webhooks/${webhookId}/test`, {
    method: 'POST',
  });
}
