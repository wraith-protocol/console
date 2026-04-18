import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getKeys } from '../api/keys';
import { useTeam } from '../hooks/useTeam';
import KeyList from '../components/keys/KeyList';
import CreateKeyModal from '../components/keys/CreateKeyModal';

export default function ApiKeys() {
  const { currentTeam } = useTeam();
  const [showCreate, setShowCreate] = useState(false);

  const { data: keys = [], isLoading } = useQuery({
    queryKey: ['keys', currentTeam?.id],
    queryFn: () => getKeys(currentTeam!.id),
    enabled: !!currentTeam,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-outline">
          Manage your API keys. Keys are shown as prefixes only after creation.
        </p>
        <button
          onClick={() => setShowCreate(true)}
          className="h-10 bg-primary px-5 font-heading text-[13px] font-semibold tracking-[0.05em] text-surface uppercase transition-colors duration-150 hover:brightness-110"
        >
          Create Key
        </button>
      </div>

      {isLoading ? (
        <div className="flex gap-1.5 py-8">
          <span className="h-1.5 w-1.5 animate-pulse bg-outline" />
          <span className="h-1.5 w-1.5 animate-pulse bg-outline [animation-delay:200ms]" />
          <span className="h-1.5 w-1.5 animate-pulse bg-outline [animation-delay:400ms]" />
        </div>
      ) : (
        <div className="border border-outline-variant bg-surface-container">
          <KeyList keys={keys} />
        </div>
      )}

      {showCreate && <CreateKeyModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
