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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-[480px] border border-outline-variant bg-surface-container p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-on-surface">Invite Member</h2>
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

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="space-y-4"
        >
          {mutation.error && (
            <div className="border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
              {mutation.error instanceof Error ? mutation.error.message : 'Failed to invite'}
            </div>
          )}

          <div>
            <label
              htmlFor="invite-email"
              className="mb-1.5 block font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase"
            >
              EMAIL
            </label>
            <input
              id="invite-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full border border-outline-variant bg-surface px-4 text-sm text-on-surface outline-none transition-colors duration-150 focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="invite-role"
              className="mb-1.5 block font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase"
            >
              ROLE
            </label>
            <select
              id="invite-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-11 w-full border border-outline-variant bg-surface px-4 text-sm text-on-surface outline-none transition-colors duration-150 focus:border-primary"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
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
              {mutation.isPending ? 'INVITING...' : 'SEND INVITE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
