import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getWebhooks,
  createWebhook,
  updateWebhook,
  deleteWebhook,
  testWebhook,
} from '../api/webhooks';
import { useTeam } from '../hooks/useTeam';

const AVAILABLE_EVENTS = [
  'agent.created',
  'agent.updated',
  'conversation.created',
  'invoice.paid',
  'key.created',
  'key.revoked',
];

export default function Webhooks() {
  const { currentTeam } = useTeam();
  const teamId = currentTeam?.id;
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newEvents, setNewEvents] = useState<string[]>([]);

  const { data: webhooks = [], isLoading } = useQuery({
    queryKey: ['webhooks', teamId],
    queryFn: () => getWebhooks(teamId!),
    enabled: !!teamId,
  });

  const createMutation = useMutation({
    mutationFn: () => createWebhook(teamId!, newUrl, newEvents),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      setShowCreate(false);
      setNewUrl('');
      setNewEvents([]);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      updateWebhook(teamId!, id, { active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteWebhook(teamId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    },
  });

  const testMutation = useMutation({
    mutationFn: (id: string) => testWebhook(teamId!, id),
  });

  function toggleEvent(event: string) {
    setNewEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event],
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-outline">Manage webhook endpoints for event notifications.</p>
        <button
          onClick={() => setShowCreate(true)}
          className="h-10 bg-primary px-5 font-heading text-[13px] font-semibold tracking-[0.05em] text-surface uppercase transition-colors duration-150 hover:brightness-110"
        >
          Add Webhook
        </button>
      </div>

      {showCreate && (
        <div className="border border-outline-variant bg-surface-container p-6">
          <h3 className="mb-5 font-heading text-sm font-semibold text-on-surface">New Webhook</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate();
            }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="webhook-url"
                className="mb-1.5 block font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase"
              >
                URL
              </label>
              <input
                id="webhook-url"
                type="url"
                required
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://example.com/webhooks"
                className="h-11 w-full border border-outline-variant bg-surface px-4 text-sm text-on-surface placeholder:text-outline outline-none transition-colors duration-150 focus:border-primary"
              />
            </div>

            <div>
              <p className="mb-2 font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase">
                EVENTS
              </p>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_EVENTS.map((event) => (
                  <button
                    key={event}
                    type="button"
                    onClick={() => toggleEvent(event)}
                    className={`h-8 px-3 font-mono text-xs transition-colors duration-150 ${
                      newEvents.includes(event)
                        ? 'bg-primary text-surface'
                        : 'border border-outline-variant text-outline hover:text-on-surface-variant'
                    }`}
                  >
                    {event}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="flex h-10 items-center border border-outline-variant px-4 text-sm text-on-surface-variant transition-colors duration-150 hover:bg-surface-bright"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || newEvents.length === 0}
                className="h-10 bg-primary px-5 font-heading text-[13px] font-semibold tracking-[0.05em] text-surface uppercase transition-colors duration-150 hover:brightness-110 disabled:opacity-30"
              >
                {createMutation.isPending ? 'CREATING...' : 'CREATE'}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="flex gap-1.5 py-8">
          <span className="h-1.5 w-1.5 animate-pulse bg-outline" />
          <span className="h-1.5 w-1.5 animate-pulse bg-outline [animation-delay:200ms]" />
          <span className="h-1.5 w-1.5 animate-pulse bg-outline [animation-delay:400ms]" />
        </div>
      ) : webhooks.length === 0 ? (
        <div className="border border-outline-variant bg-surface-container p-8 text-center">
          <p className="text-sm text-outline">No webhooks configured.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {webhooks.map((wh) => (
            <div key={wh.id} className="border border-outline-variant bg-surface-container p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <code className="font-mono text-sm text-on-surface-variant">{wh.url}</code>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {wh.events.map((event) => (
                      <span
                        key={event}
                        className="inline-flex px-2 py-0.5 font-mono text-[10px] tracking-wider text-outline bg-surface-bright uppercase"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleMutation.mutate({ id: wh.id, active: !wh.active })}
                    className={`inline-flex px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase transition-colors duration-150 ${
                      wh.active ? 'bg-tertiary/10 text-tertiary' : 'bg-surface-bright text-outline'
                    }`}
                  >
                    {wh.active ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => testMutation.mutate(wh.id)}
                    disabled={testMutation.isPending}
                    className="flex h-7 items-center border border-outline-variant px-3 text-xs text-on-surface-variant transition-colors duration-150 hover:bg-surface-bright"
                  >
                    Test
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(wh.id)}
                    className="text-xs text-error transition-colors duration-150 hover:text-error/80"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
