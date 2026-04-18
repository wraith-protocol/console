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
    return (
      <div className="flex gap-1.5 py-8">
        <span className="h-1.5 w-1.5 animate-pulse bg-outline" />
        <span className="h-1.5 w-1.5 animate-pulse bg-outline [animation-delay:200ms]" />
        <span className="h-1.5 w-1.5 animate-pulse bg-outline [animation-delay:400ms]" />
      </div>
    );
  }

  if (!agent) {
    return <p className="text-sm text-error">Agent not found</p>;
  }

  return (
    <div className="space-y-6">
      <Link
        to="/agents"
        className="inline-flex text-sm text-outline transition-colors duration-150 hover:text-on-surface-variant"
      >
        &larr; Back to Agents
      </Link>

      <div className="border border-outline-variant bg-surface-container p-6">
        <h2 className="font-heading text-lg font-semibold text-on-surface">{agent.name}</h2>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase">
              Chain
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">{agent.chain}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase">
              Address
            </p>
            <code className="mt-1 block font-mono text-sm text-on-surface-variant">
              {agent.address.slice(0, 10)}...{agent.address.slice(-6)}
            </code>
          </div>
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase">
              Balance
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">{agent.balance}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase">
              Status
            </p>
            <span
              className={`mt-1 inline-flex px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase ${
                agent.status === 'active'
                  ? 'bg-tertiary/10 text-tertiary'
                  : 'bg-surface-bright text-outline'
              }`}
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
              <tr className="border-b border-outline-variant">
                <th className="px-5 py-3 font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase">
                  Title
                </th>
                <th className="px-5 py-3 font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase">
                  Created
                </th>
                <th className="px-5 py-3 font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {conversations.map((conv) => (
                <tr
                  key={conv.id}
                  className="border-b border-outline-variant/30 transition-colors duration-150 hover:bg-surface-bright"
                >
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
