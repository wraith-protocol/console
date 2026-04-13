import { apiClient } from './client';

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  limits: {
    requestsPerMonth: number;
    tokensPerMonth: number;
    apiKeys: number;
    teamMembers: number;
  };
}

export interface CurrentBilling {
  plan: Plan;
  usage: {
    requests: number;
    tokens: number;
  };
  stripeCustomerId: string | null;
  currentPeriodEnd: string;
}

export function getPlans() {
  return apiClient<Plan[]>('/billing/plans');
}

export function getCurrentBilling(teamId: string) {
  return apiClient<CurrentBilling>(`/billing/current?teamId=${teamId}`);
}

export function createCheckout(teamId: string, planId: string) {
  return apiClient<{ url: string }>('/billing/checkout', {
    method: 'POST',
    body: JSON.stringify({ teamId, planId }),
  });
}

export function createPortalSession(teamId: string) {
  return apiClient<{ url: string }>('/billing/portal', {
    method: 'POST',
    body: JSON.stringify({ teamId }),
  });
}
