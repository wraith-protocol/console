import { apiClient } from './client';

export interface Team {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  developerId: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
}

export function getTeams() {
  return apiClient<Team[]>('/teams');
}

export function getTeam(id: string) {
  return apiClient<Team>(`/teams/${id}`);
}

export function createTeam(name: string) {
  return apiClient<Team>('/teams', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}

export function updateTeam(id: string, data: { name?: string; slug?: string }) {
  return apiClient<Team>(`/teams/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteTeam(id: string) {
  return apiClient<void>(`/teams/${id}`, { method: 'DELETE' });
}

export function getMembers(teamId: string) {
  return apiClient<TeamMember[]>(`/teams/${teamId}/members`);
}

export function inviteMember(teamId: string, email: string, role: string) {
  return apiClient<TeamMember>(`/teams/${teamId}/members`, {
    method: 'POST',
    body: JSON.stringify({ email, role }),
  });
}

export function updateMemberRole(teamId: string, memberId: string, role: string) {
  return apiClient<TeamMember>(`/teams/${teamId}/members/${memberId}`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
}

export function removeMember(teamId: string, memberId: string) {
  return apiClient<void>(`/teams/${teamId}/members/${memberId}`, { method: 'DELETE' });
}
