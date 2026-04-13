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
    return <p className="text-sm text-outline">Loading...</p>;
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
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-outline-variant text-xs text-outline">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Chain</th>
            <th className="px-4 py-3 font-medium">Address</th>
            <th className="px-4 py-3 font-medium">Created</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent.id} className="border-b border-outline-variant hover:bg-surface-bright">
              <td className="px-4 py-3">
                <Link
                  to={`/agents/${agent.id}`}
                  className="text-on-surface-variant hover:text-on-surface"
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
  );
}
