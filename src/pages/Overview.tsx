import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useTeam } from '../hooks/useTeam';
import { useUsageSummary } from '../hooks/useUsage';
import { getKeys } from '../api/keys';
import { getCurrentBilling } from '../api/billing';
import StatsCard from '../components/dashboard/StatsCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import type { ActivityItem } from '../components/dashboard/RecentActivity';

export default function Overview() {
  const { currentTeam } = useTeam();
  const teamId = currentTeam?.id;

  const { data: usage } = useUsageSummary(teamId);
  const { data: keys } = useQuery({
    queryKey: ['keys', teamId],
    queryFn: () => getKeys(teamId!),
    enabled: !!teamId,
  });
  const { data: billing } = useQuery({
    queryKey: ['billing', teamId],
    queryFn: () => getCurrentBilling(teamId!),
    enabled: !!teamId,
  });

  const recentActivity: ActivityItem[] = [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Requests Today" value={usage?.requestsToday ?? '—'} />
        <StatsCard label="Active Agents" value={usage?.activeAgents ?? '—'} />
        <StatsCard label="Current Plan" value={billing?.plan.name ?? '—'} />
        <StatsCard label="API Keys" value={keys?.length ?? '—'} />
      </div>

      <RecentActivity items={recentActivity} />

      <div className="flex flex-wrap gap-3">
        <Link
          to="/agents"
          className="flex h-10 items-center border border-outline-variant px-4 text-sm text-on-surface-variant transition-colors duration-150 hover:bg-surface-bright"
        >
          Create Agent
        </Link>
        <Link
          to="/keys"
          className="flex h-10 items-center border border-outline-variant px-4 text-sm text-on-surface-variant transition-colors duration-150 hover:bg-surface-bright"
        >
          Create API Key
        </Link>
        <a
          href="https://docs.wraithprotocol.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 items-center border border-outline-variant px-4 text-sm text-on-surface-variant transition-colors duration-150 hover:bg-surface-bright"
        >
          View Docs
        </a>
      </div>
    </div>
  );
}
