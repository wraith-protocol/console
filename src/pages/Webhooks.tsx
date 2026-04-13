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
          className="bg-primary px-4 py-2 text-sm font-medium text-surface hover:bg-primary/90"
        >
          Add Webhook
        </button>
      </div>

      {showCreate && (
        <div className="border border-outline-variant bg-surface-container p-5">
          <h3 className="mb-4 font-heading text-sm font-semibold text-on-surface">New Webhook</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate();
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="webhook-url" className="mb-1 block text-sm text-on-surface-variant">
                URL
              </label>
              <input
                id="webhook-url"
                type="url"
                required
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://example.com/webhooks"
                className="w-full border border-outline-variant bg-surface-bright px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
              />
            </div>

            <div>
              <p className="mb-2 text-sm text-on-surface-variant">Events</p>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_EVENTS.map((event) => (
                  <button
                    key={event}
                    type="button"
                    onClick={() => toggleEvent(event)}
                    className={`px-3 py-1 text-xs ${
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

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="border border-outline-variant px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-bright"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || newEvents.length === 0}
                className="bg-primary px-4 py-2 text-sm font-medium text-surface hover:bg-primary/90 disabled:opacity-50"
              >
                {createMutation.isPending ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-outline">Loading...</p>
      ) : webhooks.length === 0 ? (
        <div className="border border-outline-variant bg-surface-container p-8 text-center">
          <p className="text-sm text-outline">No webhooks configured.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {webhooks.map((wh) => (
            <div key={wh.id} className="border border-outline-variant bg-surface-container p-5">
              <div className="flex items-start justify-between">
                <div>
                  <code className="font-mono text-sm text-on-surface-variant">{wh.url}</code>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {wh.events.map((event) => (
                      <span
                        key={event}
                        className="border border-outline-variant px-2 py-0.5 text-xs text-outline"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleMutation.mutate({ id: wh.id, active: !wh.active })}
                    className={`px-3 py-1 text-xs ${wh.active ? 'text-tertiary' : 'text-outline'}`}
                  >
                    {wh.active ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => testMutation.mutate(wh.id)}
                    disabled={testMutation.isPending}
                    className="border border-outline-variant px-3 py-1 text-xs text-on-surface-variant hover:bg-surface-bright"
                  >
                    Test
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(wh.id)}
                    className="text-xs text-error hover:text-error/80"
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
