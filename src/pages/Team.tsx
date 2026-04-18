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
          className="h-10 bg-primary px-5 font-heading text-[13px] font-semibold tracking-[0.05em] text-surface uppercase transition-colors duration-150 hover:brightness-110"
        >
          Invite Member
        </button>
      </div>

      <div className="border border-outline-variant bg-surface-container">
        {isLoading ? (
          <div className="flex gap-1.5 p-5">
            <span className="h-1.5 w-1.5 animate-pulse bg-outline" />
            <span className="h-1.5 w-1.5 animate-pulse bg-outline [animation-delay:200ms]" />
            <span className="h-1.5 w-1.5 animate-pulse bg-outline [animation-delay:400ms]" />
          </div>
        ) : (
          <MemberList members={members} />
        )}
      </div>

      <div className="border border-outline-variant bg-surface-container p-6">
        <h3 className="mb-5 font-heading text-sm font-semibold text-on-surface">Team Settings</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateMutation.mutate();
          }}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="team-name"
              className="mb-1.5 block font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase"
            >
              TEAM NAME
            </label>
            <input
              id="team-name"
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="h-11 w-full max-w-sm border border-outline-variant bg-surface px-4 text-sm text-on-surface outline-none transition-colors duration-150 focus:border-primary"
            />
          </div>
          <div>
            <label
              htmlFor="team-slug"
              className="mb-1.5 block font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase"
            >
              SLUG
            </label>
            <input
              id="team-slug"
              type="text"
              value={teamSlug}
              onChange={(e) => setTeamSlug(e.target.value)}
              className="h-11 w-full max-w-sm border border-outline-variant bg-surface px-4 text-sm text-on-surface outline-none transition-colors duration-150 focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="h-10 bg-primary px-5 font-heading text-[13px] font-semibold tracking-[0.05em] text-surface uppercase transition-colors duration-150 hover:brightness-110 disabled:opacity-30"
          >
            {updateMutation.isPending ? 'SAVING...' : 'SAVE'}
          </button>
        </form>
      </div>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
    </div>
  );
}
