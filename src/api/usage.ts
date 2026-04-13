import { apiClient } from './client';

export interface UsageSummary {
  requestsToday: number;
  requestsThisMonth: number;
  tokensThisMonth: number;
  activeAgents: number;
}

export interface DailyUsage {
  date: string;
  requests: number;
  tokens: number;
}

export interface UsageByKey {
  keyId: string;
  keyName: string;
  keyPrefix: string;
  requests: number;
  tokens: number;
}

export interface UsageByEndpoint {
  endpoint: string;
  requests: number;
}

export function getUsageSummary(teamId: string) {
  return apiClient<UsageSummary>(`/usage/summary?teamId=${teamId}`);
}

export function getDailyUsage(teamId: string, from: string, to: string) {
  return apiClient<DailyUsage[]>(`/usage/daily?teamId=${teamId}&from=${from}&to=${to}`);
}

export function getUsageByKey(teamId: string) {
  return apiClient<UsageByKey[]>(`/usage/by-key?teamId=${teamId}`);
}

export function getUsageByEndpoint(teamId: string) {
  return apiClient<UsageByEndpoint[]>(`/usage/by-endpoint?teamId=${teamId}`);
}
