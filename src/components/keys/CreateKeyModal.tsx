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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-[480px] border border-outline-variant bg-surface-container p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-on-surface">
            {createdKey ? 'API Key Created' : 'Create API Key'}
          </h2>
          <button
            onClick={onClose}
            className="text-outline transition-colors duration-150 hover:text-on-surface-variant"
            aria-label="Close"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        {createdKey ? (
          <div className="space-y-4">
            <div className="border border-outline-variant bg-surface p-4">
              <p className="mb-3 text-xs text-error">
                This key will only be shown once. Copy it now.
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 break-all font-mono text-sm text-on-surface">
                  {createdKey}
                </code>
                <button
                  onClick={handleCopy}
                  className="flex h-8 items-center border border-outline-variant px-3 text-xs text-on-surface-variant transition-colors duration-150 hover:bg-surface-bright"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-11 w-full bg-primary font-heading text-[13px] font-semibold tracking-[0.05em] text-surface uppercase transition-colors duration-150 hover:brightness-110"
            >
              DONE
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
              <div className="border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
                {mutation.error instanceof Error ? mutation.error.message : 'Failed to create key'}
              </div>
            )}

            <div>
              <label
                htmlFor="key-name"
                className="mb-1.5 block font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase"
              >
                NAME
              </label>
              <input
                id="key-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. production, staging"
                className="h-11 w-full border border-outline-variant bg-surface px-4 text-sm text-on-surface placeholder:text-outline outline-none transition-colors duration-150 focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="key-environment"
                className="mb-1.5 block font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase"
              >
                ENVIRONMENT
              </label>
              <select
                id="key-environment"
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as 'live' | 'test')}
                className="h-11 w-full border border-outline-variant bg-surface px-4 text-sm text-on-surface outline-none transition-colors duration-150 focus:border-primary"
              >
                <option value="test">Test</option>
                <option value="live">Live</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="h-11 flex-1 border border-outline-variant text-sm text-on-surface-variant transition-colors duration-150 hover:bg-surface-bright"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="h-11 flex-1 bg-primary font-heading text-[13px] font-semibold tracking-[0.05em] text-surface uppercase transition-colors duration-150 hover:brightness-110 disabled:opacity-30"
              >
                {mutation.isPending ? 'CREATING...' : 'CREATE KEY'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
