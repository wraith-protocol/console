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
    return <p className="p-5 text-sm text-outline">No API keys yet. Create one to get started.</p>;
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="px-4 py-3 font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase">
                Name
              </th>
              <th className="px-4 py-3 font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase">
                Key Prefix
              </th>
              <th className="px-4 py-3 font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase">
                Environment
              </th>
              <th className="px-4 py-3 font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase">
                Last Used
              </th>
              <th className="px-4 py-3 font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase">
                Created
              </th>
              <th className="px-4 py-3 font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {keys.map((key) => (
              <tr
                key={key.id}
                className="border-b border-outline-variant/30 transition-colors duration-150 hover:bg-surface-bright"
              >
                <td className="px-4 py-3 text-on-surface-variant">{key.name}</td>
                <td className="px-4 py-3">
                  <code className="font-mono text-xs text-on-surface-variant">
                    {key.keyPrefix}...
                  </code>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase ${
                      key.environment === 'live'
                        ? 'bg-tertiary/10 text-tertiary'
                        : 'bg-surface-bright text-on-surface-variant'
                    }`}
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
                        className="text-xs text-error transition-colors duration-150 hover:text-error/80"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="text-xs text-outline transition-colors duration-150 hover:text-on-surface-variant"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(key.id)}
                      className="text-xs text-error transition-colors duration-150 hover:text-error/80"
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

      <div className="space-y-0 md:hidden">
        {keys.map((key) => (
          <div key={key.id} className="border-b border-outline-variant/30 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-on-surface">{key.name}</span>
              <span
                className={`inline-flex px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase ${
                  key.environment === 'live'
                    ? 'bg-tertiary/10 text-tertiary'
                    : 'bg-surface-bright text-on-surface-variant'
                }`}
              >
                {key.environment}
              </span>
            </div>
            <code className="block font-mono text-xs text-outline">{key.keyPrefix}...</code>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-outline">
                {key.lastUsedAt
                  ? `Used ${new Date(key.lastUsedAt).toLocaleDateString()}`
                  : 'Never used'}
              </span>
              {confirmId === key.id ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => revokeMutation.mutate(key.id)}
                    disabled={revokeMutation.isPending}
                    className="text-xs text-error"
                  >
                    Confirm
                  </button>
                  <button onClick={() => setConfirmId(null)} className="text-xs text-outline">
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={() => setConfirmId(key.id)} className="text-xs text-error">
                  Revoke
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
