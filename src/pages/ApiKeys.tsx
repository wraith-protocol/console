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
          className="bg-primary px-4 py-2 text-sm font-medium text-surface hover:bg-primary/90"
        >
          Create Key
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-outline">Loading...</p>
      ) : (
        <div className="border border-outline-variant bg-surface-container">
          <KeyList keys={keys} />
        </div>
      )}

      {showCreate && <CreateKeyModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
