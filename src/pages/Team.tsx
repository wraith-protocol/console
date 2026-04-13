import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMembers, updateTeam } from '../api/teams';
import { useTeam } from '../hooks/useTeam';
import MemberList from '../components/team/MemberList';
import InviteModal from '../components/team/InviteModal';

export default function Team() {
  const { currentTeam } = useTeam();
  const queryClient = useQueryClient();
  const [showInvite, setShowInvite] = useState(false);
  const [teamName, setTeamName] = useState(currentTeam?.name ?? '');
  const [teamSlug, setTeamSlug] = useState(currentTeam?.slug ?? '');

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['members', currentTeam?.id],
    queryFn: () => getMembers(currentTeam!.id),
    enabled: !!currentTeam,
  });

  const updateMutation = useMutation({
    mutationFn: () => updateTeam(currentTeam!.id, { name: teamName, slug: teamSlug }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-outline">Manage your team members and settings.</p>
        <button
          onClick={() => setShowInvite(true)}
          className="bg-primary px-4 py-2 text-sm font-medium text-surface hover:bg-primary/90"
        >
          Invite Member
        </button>
      </div>

      <div className="border border-outline-variant bg-surface-container">
        {isLoading ? (
          <p className="p-5 text-sm text-outline">Loading...</p>
        ) : (
          <MemberList members={members} />
        )}
      </div>

      <div className="border border-outline-variant bg-surface-container p-5">
        <h3 className="mb-4 font-heading text-sm font-semibold text-on-surface">Team Settings</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateMutation.mutate();
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="team-name" className="mb-1 block text-sm text-on-surface-variant">
              Team Name
            </label>
            <input
              id="team-name"
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full max-w-sm border border-outline-variant bg-surface-bright px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="team-slug" className="mb-1 block text-sm text-on-surface-variant">
              Slug
            </label>
            <input
              id="team-slug"
              type="text"
              value={teamSlug}
              onChange={(e) => setTeamSlug(e.target.value)}
              className="w-full max-w-sm border border-outline-variant bg-surface-bright px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-primary px-4 py-2 text-sm font-medium text-surface hover:bg-primary/90 disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
    </div>
  );
}
