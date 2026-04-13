import { apiClient } from './client';

export interface Agent {
  id: string;
  name: string;
  chain: string;
  address: string;
  createdAt: string;
}

export interface AgentDetail extends Agent {
  balance: string;
  status: string;
}

export interface Conversation {
  id: string;
  agentId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export function getAgents(teamId: string) {
  return apiClient<Agent[]>(`/teams/${teamId}/agents`);
}

export function getAgent(teamId: string, agentId: string) {
  return apiClient<AgentDetail>(`/teams/${teamId}/agents/${agentId}`);
}

export function getAgentConversations(teamId: string, agentId: string) {
  return apiClient<Conversation[]>(`/teams/${teamId}/agents/${agentId}/conversations`);
}
