import { useParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getAgent, getAgentConversations } from '../api/agents';
import { useTeam } from '../hooks/useTeam';

export default function AgentDetail() {
  const { id } = useParams<{ id: string }>();
  const { currentTeam } = useTeam();
  const teamId = currentTeam?.id;

  const { data: agent, isLoading } = useQuery({
    queryKey: ['agent', teamId, id],
    queryFn: () => getAgent(teamId!, id!),
    enabled: !!teamId && !!id,
  });

  const { data: conversations = [] } = useQuery({
    queryKey: ['agent-conversations', teamId, id],
    queryFn: () => getAgentConversations(teamId!, id!),
    enabled: !!teamId && !!id,
  });

  if (isLoading) {
    return <p className="text-sm text-outline">Loading...</p>;
  }

  if (!agent) {
    return <p className="text-sm text-error">Agent not found</p>;
  }

  return (
    <div className="space-y-6">
      <Link to="/agents" className="text-sm text-outline hover:text-on-surface-variant">
        &larr; Back to Agents
      </Link>

      <div className="border border-outline-variant bg-surface-container p-5">
        <h2 className="font-heading text-lg font-semibold text-on-surface">{agent.name}</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-outline">Chain</p>
            <p className="text-sm text-on-surface-variant">{agent.chain}</p>
          </div>
          <div>
            <p className="text-xs text-outline">Address</p>
            <code className="font-mono text-sm text-on-surface-variant">
              {agent.address.slice(0, 10)}...{agent.address.slice(-6)}
            </code>
          </div>
          <div>
            <p className="text-xs text-outline">Balance</p>
            <p className="text-sm text-on-surface-variant">{agent.balance}</p>
          </div>
          <div>
            <p className="text-xs text-outline">Status</p>
            <span
              className={`text-sm ${agent.status === 'active' ? 'text-tertiary' : 'text-outline'}`}
            >
              {agent.status}
            </span>
          </div>
        </div>
      </div>

      <div className="border border-outline-variant bg-surface-container">
        <h3 className="p-5 pb-3 font-heading text-sm font-semibold text-on-surface">
          Recent Conversations
        </h3>
        {conversations.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-outline-variant text-xs text-outline">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Created</th>
                <th className="px-5 py-3 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {conversations.map((conv) => (
                <tr key={conv.id} className="border-b border-outline-variant">
                  <td className="px-5 py-3 text-on-surface-variant">{conv.title}</td>
                  <td className="px-5 py-3 text-xs text-outline">
                    {new Date(conv.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-xs text-outline">
                    {new Date(conv.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="px-5 pb-5 text-sm text-outline">No conversations yet</p>
        )}
      </div>
    </div>
  );
}
