import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getAgents } from '../api/agents';
import { useTeam } from '../hooks/useTeam';

export default function Agents() {
  const { currentTeam } = useTeam();

  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['agents', currentTeam?.id],
    queryFn: () => getAgents(currentTeam!.id),
    enabled: !!currentTeam,
  });

  if (isLoading) {
    return (
      <div className="flex gap-1.5 py-8">
        <span className="h-1.5 w-1.5 animate-pulse bg-outline" />
        <span className="h-1.5 w-1.5 animate-pulse bg-outline [animation-delay:200ms]" />
        <span className="h-1.5 w-1.5 animate-pulse bg-outline [animation-delay:400ms]" />
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="border border-outline-variant bg-surface-container p-8 text-center">
        <p className="text-sm text-outline">
          No agents found. Create agents using the SDK with your API keys.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-outline-variant bg-surface-container">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="px-4 py-3 font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase">
                Name
              </th>
              <th className="px-4 py-3 font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase">
                Chain
              </th>
              <th className="px-4 py-3 font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase">
                Address
              </th>
              <th className="px-4 py-3 font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase">
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr
                key={agent.id}
                className="border-b border-outline-variant/30 transition-colors duration-150 hover:bg-surface-bright"
              >
                <td className="px-4 py-3">
                  <Link
                    to={`/agents/${agent.id}`}
                    className="text-on-surface-variant transition-colors duration-150 hover:text-on-surface"
                  >
                    {agent.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-xs text-outline">{agent.chain}</td>
                <td className="px-4 py-3">
                  <code className="font-mono text-xs text-outline">
                    {agent.address.slice(0, 6)}...{agent.address.slice(-4)}
                  </code>
                </td>
                <td className="px-4 py-3 text-xs text-outline">
                  {new Date(agent.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-0 md:hidden">
        {agents.map((agent) => (
          <Link
            key={agent.id}
            to={`/agents/${agent.id}`}
            className="block border-b border-outline-variant/30 p-4 transition-colors duration-150 hover:bg-surface-bright"
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm text-on-surface">{agent.name}</span>
              <span className="text-xs text-outline">{agent.chain}</span>
            </div>
            <code className="block font-mono text-xs text-outline">
              {agent.address.slice(0, 6)}...{agent.address.slice(-4)}
            </code>
          </Link>
        ))}
      </div>
    </div>
  );
}
