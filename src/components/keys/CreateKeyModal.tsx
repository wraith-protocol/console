import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createKey } from '../../api/keys';
import { useTeam } from '../../hooks/useTeam';

export default function CreateKeyModal({ onClose }: { onClose: () => void }) {
  const { currentTeam } = useTeam();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [environment, setEnvironment] = useState<'live' | 'test'>('test');
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const mutation = useMutation({
    mutationFn: () => createKey(currentTeam!.id, name, environment),
    onSuccess: (data) => {
      setCreatedKey(data.key);
      queryClient.invalidateQueries({ queryKey: ['keys'] });
    },
  });

  async function handleCopy() {
    if (createdKey) {
      await navigator.clipboard.writeText(createdKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/80">
      <div className="w-full max-w-md border border-outline-variant bg-surface-container p-6">
        <h2 className="mb-4 font-heading text-lg font-semibold text-on-surface">
          {createdKey ? 'API Key Created' : 'Create API Key'}
        </h2>

        {createdKey ? (
          <div className="space-y-4">
            <div className="border border-outline-variant bg-surface-bright p-3">
              <p className="mb-2 text-xs text-error">
                This key will only be shown once. Copy it now.
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 break-all font-mono text-sm text-on-surface">
                  {createdKey}
                </code>
                <button
                  onClick={handleCopy}
                  className="border border-outline-variant px-3 py-1 text-xs text-on-surface-variant hover:bg-surface"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-primary px-4 py-2 text-sm font-medium text-surface hover:bg-primary/90"
            >
              Done
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
            className="space-y-4"
          >
            {mutation.error && (
              <div className="border border-error bg-error/10 px-3 py-2 text-sm text-error">
                {mutation.error instanceof Error ? mutation.error.message : 'Failed to create key'}
              </div>
            )}

            <div>
              <label htmlFor="key-name" className="mb-1 block text-sm text-on-surface-variant">
                Name
              </label>
              <input
                id="key-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. production, staging"
                className="w-full border border-outline-variant bg-surface-bright px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="key-environment"
                className="mb-1 block text-sm text-on-surface-variant"
              >
                Environment
              </label>
              <select
                id="key-environment"
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as 'live' | 'test')}
                className="w-full border border-outline-variant bg-surface-bright px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
              >
                <option value="test">Test</option>
                <option value="live">Live</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-outline-variant px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-bright"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 bg-primary px-4 py-2 text-sm font-medium text-surface hover:bg-primary/90 disabled:opacity-50"
              >
                {mutation.isPending ? 'Creating...' : 'Create Key'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
