import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inviteMember } from '../../api/teams';
import { useTeam } from '../../hooks/useTeam';

export default function InviteModal({ onClose }: { onClose: () => void }) {
  const { currentTeam } = useTeam();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');

  const mutation = useMutation({
    mutationFn: () => inviteMember(currentTeam!.id, email, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/80">
      <div className="w-full max-w-md border border-outline-variant bg-surface-container p-6">
        <h2 className="mb-4 font-heading text-lg font-semibold text-on-surface">Invite Member</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="space-y-4"
        >
          {mutation.error && (
            <div className="border border-error bg-error/10 px-3 py-2 text-sm text-error">
              {mutation.error instanceof Error ? mutation.error.message : 'Failed to invite'}
            </div>
          )}

          <div>
            <label htmlFor="invite-email" className="mb-1 block text-sm text-on-surface-variant">
              Email
            </label>
            <input
              id="invite-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-outline-variant bg-surface-bright px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="invite-role" className="mb-1 block text-sm text-on-surface-variant">
              Role
            </label>
            <select
              id="invite-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-outline-variant bg-surface-bright px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
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
              {mutation.isPending ? 'Inviting...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
