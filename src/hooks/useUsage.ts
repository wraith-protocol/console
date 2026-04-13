import { useQuery } from '@tanstack/react-query';
import { getUsageSummary, getDailyUsage, getUsageByKey, getUsageByEndpoint } from '../api/usage';

export function useUsageSummary(teamId: string | undefined) {
  return useQuery({
    queryKey: ['usage', 'summary', teamId],
    queryFn: () => getUsageSummary(teamId!),
    enabled: !!teamId,
  });
}

export function useDailyUsage(teamId: string | undefined, from: string, to: string) {
  return useQuery({
    queryKey: ['usage', 'daily', teamId, from, to],
    queryFn: () => getDailyUsage(teamId!, from, to),
    enabled: !!teamId,
  });
}

export function useUsageByKey(teamId: string | undefined) {
  return useQuery({
    queryKey: ['usage', 'by-key', teamId],
    queryFn: () => getUsageByKey(teamId!),
    enabled: !!teamId,
  });
}

export function useUsageByEndpoint(teamId: string | undefined) {
  return useQuery({
    queryKey: ['usage', 'by-endpoint', teamId],
    queryFn: () => getUsageByEndpoint(teamId!),
    enabled: !!teamId,
  });
}
