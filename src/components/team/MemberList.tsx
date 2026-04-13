import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMemberRole, removeMember, type TeamMember } from '../../api/teams';
import { useTeam } from '../../hooks/useTeam';

export default function MemberList({ members }: { members: TeamMember[] }) {
  const { currentTeam } = useTeam();
  const queryClient = useQueryClient();
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  const roleMutation = useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: string }) =>
      updateMemberRole(currentTeam!.id, memberId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (memberId: string) => removeMember(currentTeam!.id, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      setConfirmRemoveId(null);
    },
  });

  if (members.length === 0) {
    return <p className="text-sm text-outline">No team members</p>;
  }

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-outline-variant text-xs text-outline">
          <th className="px-4 py-3 font-medium">Name</th>
          <th className="px-4 py-3 font-medium">Email</th>
          <th className="px-4 py-3 font-medium">Role</th>
          <th className="px-4 py-3 font-medium">Joined</th>
          <th className="px-4 py-3 font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member) => (
          <tr key={member.id} className="border-b border-outline-variant">
            <td className="px-4 py-3 text-on-surface-variant">{member.name}</td>
            <td className="px-4 py-3 text-outline">{member.email}</td>
            <td className="px-4 py-3">
              {member.role === 'owner' ? (
                <span className="text-xs text-primary">{member.role}</span>
              ) : (
                <select
                  value={member.role}
                  onChange={(e) =>
                    roleMutation.mutate({ memberId: member.id, role: e.target.value })
                  }
                  className="border border-outline-variant bg-surface-bright px-2 py-1 text-xs text-on-surface-variant outline-none"
                >
                  <option value="admin">admin</option>
                  <option value="member">member</option>
                </select>
              )}
            </td>
            <td className="px-4 py-3 text-xs text-outline">
              {new Date(member.joinedAt).toLocaleDateString()}
            </td>
            <td className="px-4 py-3">
              {member.role !== 'owner' && (
                <>
                  {confirmRemoveId === member.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeMutation.mutate(member.id)}
                        disabled={removeMutation.isPending}
                        className="text-xs text-error hover:text-error/80"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmRemoveId(null)}
                        className="text-xs text-outline hover:text-on-surface-variant"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmRemoveId(member.id)}
                      className="text-xs text-error hover:text-error/80"
                    >
                      Remove
                    </button>
                  )}
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
