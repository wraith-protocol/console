import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { revokeKey, type ApiKey } from '../../api/keys';
import { useTeam } from '../../hooks/useTeam';

export default function KeyList({ keys }: { keys: ApiKey[] }) {
  const { currentTeam } = useTeam();
  const queryClient = useQueryClient();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const revokeMutation = useMutation({
    mutationFn: (keyId: string) => revokeKey(currentTeam!.id, keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keys'] });
      setConfirmId(null);
    },
  });

  if (keys.length === 0) {
    return <p className="text-sm text-outline">No API keys yet. Create one to get started.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-outline-variant text-xs text-outline">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Key Prefix</th>
            <th className="px-4 py-3 font-medium">Environment</th>
            <th className="px-4 py-3 font-medium">Last Used</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => (
            <tr key={key.id} className="border-b border-outline-variant">
              <td className="px-4 py-3 text-on-surface-variant">{key.name}</td>
              <td className="px-4 py-3">
                <code className="font-mono text-xs text-outline">{key.keyPrefix}...</code>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs ${key.environment === 'live' ? 'text-tertiary' : 'text-outline'}`}
                >
                  {key.environment}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-outline">
                {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : 'Never'}
              </td>
              <td className="px-4 py-3 text-xs text-outline">
                {new Date(key.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                {confirmId === key.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => revokeMutation.mutate(key.id)}
                      disabled={revokeMutation.isPending}
                      className="text-xs text-error hover:text-error/80"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="text-xs text-outline hover:text-on-surface-variant"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmId(key.id)}
                    className="text-xs text-error hover:text-error/80"
                  >
                    Revoke
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
