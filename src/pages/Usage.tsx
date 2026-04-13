import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTeam } from '../hooks/useTeam';
import {
  useDailyUsage,
  useUsageByKey,
  useUsageByEndpoint,
  useUsageSummary,
} from '../hooks/useUsage';
import { useQuery } from '@tanstack/react-query';
import { getCurrentBilling } from '../api/billing';
import UsageMeter from '../components/billing/UsageMeter';

type Period = 'daily' | 'weekly' | 'monthly';

function getDateRange(period: Period) {
  const to = new Date();
  const from = new Date();
  if (period === 'daily') from.setDate(from.getDate() - 7);
  else if (period === 'weekly') from.setDate(from.getDate() - 30);
  else from.setDate(from.getDate() - 90);
  return {
    from: from.toISOString().split('T')[0]!,
    to: to.toISOString().split('T')[0]!,
  };
}

const tooltipStyle = {
  backgroundColor: '#141414',
  border: '1px solid #444444',
  borderRadius: 0,
  color: '#c4c7c5',
  fontSize: 12,
};

export default function Usage() {
  const { currentTeam } = useTeam();
  const teamId = currentTeam?.id;
  const [period, setPeriod] = useState<Period>('daily');
  const { from, to } = getDateRange(period);

  const { data: daily = [] } = useDailyUsage(teamId, from, to);
  const { data: byEndpoint = [] } = useUsageByEndpoint(teamId);
  const { data: byKey = [] } = useUsageByKey(teamId);
  const { data: summary } = useUsageSummary(teamId);
  const { data: billing } = useQuery({
    queryKey: ['billing', teamId],
    queryFn: () => getCurrentBilling(teamId!),
    enabled: !!teamId,
  });

  return (
    <div className="space-y-6">
      {billing && summary && (
        <div className="border border-outline-variant bg-surface-container p-5">
          <h3 className="mb-4 font-heading text-sm font-semibold text-on-surface">Plan Usage</h3>
          <div className="space-y-3">
            <UsageMeter
              label="Requests"
              current={billing.usage.requests}
              limit={billing.plan.limits.requestsPerMonth}
            />
            <UsageMeter
              label="Tokens"
              current={billing.usage.tokens}
              limit={billing.plan.limits.tokensPerMonth}
            />
          </div>
        </div>
      )}

      <div className="border border-outline-variant bg-surface-container p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-sm font-semibold text-on-surface">Requests Over Time</h3>
          <div className="flex gap-1">
            {(['daily', 'weekly', 'monthly'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs ${
                  period === p
                    ? 'bg-surface-bright text-on-surface'
                    : 'text-outline hover:text-on-surface-variant'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        {daily.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
              <XAxis dataKey="date" stroke="#767575" tick={{ fontSize: 12 }} />
              <YAxis stroke="#767575" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="requests"
                stroke="#c6c6c7"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-outline">No data available</p>
        )}
      </div>

      <div className="border border-outline-variant bg-surface-container p-5">
        <h3 className="mb-4 font-heading text-sm font-semibold text-on-surface">
          Requests by Endpoint
        </h3>
        {byEndpoint.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byEndpoint}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
              <XAxis dataKey="endpoint" stroke="#767575" tick={{ fontSize: 10 }} />
              <YAxis stroke="#767575" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="requests" fill="#c6c6c7" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-outline">No data available</p>
        )}
      </div>

      <div className="border border-outline-variant bg-surface-container p-5">
        <h3 className="mb-4 font-heading text-sm font-semibold text-on-surface">Token Usage</h3>
        {daily.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
              <XAxis dataKey="date" stroke="#767575" tick={{ fontSize: 12 }} />
              <YAxis stroke="#767575" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="tokens" stroke="#22c55e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-outline">No data available</p>
        )}
      </div>

      <div className="border border-outline-variant bg-surface-container">
        <h3 className="p-5 pb-3 font-heading text-sm font-semibold text-on-surface">
          Usage by API Key
        </h3>
        {byKey.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-outline-variant text-xs text-outline">
                <th className="px-5 py-3 font-medium">Key</th>
                <th className="px-5 py-3 font-medium">Prefix</th>
                <th className="px-5 py-3 font-medium">Requests</th>
                <th className="px-5 py-3 font-medium">Tokens</th>
              </tr>
            </thead>
            <tbody>
              {byKey.map((k) => (
                <tr key={k.keyId} className="border-b border-outline-variant">
                  <td className="px-5 py-3 text-on-surface-variant">{k.keyName}</td>
                  <td className="px-5 py-3 font-mono text-xs text-outline">{k.keyPrefix}...</td>
                  <td className="px-5 py-3 text-on-surface-variant">
                    {k.requests.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-on-surface-variant">{k.tokens.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="px-5 pb-5 text-sm text-outline">No data available</p>
        )}
      </div>
    </div>
  );
}
