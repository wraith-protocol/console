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
    return <p className="p-5 text-sm text-outline">No team members</p>;
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
                Email
              </th>
              <th className="px-4 py-3 font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase">
                Role
              </th>
              <th className="px-4 py-3 font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase">
                Joined
              </th>
              <th className="px-4 py-3 font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr
                key={member.id}
                className="border-b border-outline-variant/30 transition-colors duration-150 hover:bg-surface-bright"
              >
                <td className="px-4 py-3 text-on-surface-variant">{member.name}</td>
                <td className="px-4 py-3 text-outline">{member.email}</td>
                <td className="px-4 py-3">
                  {member.role === 'owner' ? (
                    <span className="inline-flex px-2 py-0.5 font-mono text-[10px] tracking-wider text-primary uppercase bg-surface-bright">
                      {member.role}
                    </span>
                  ) : (
                    <select
                      value={member.role}
                      onChange={(e) =>
                        roleMutation.mutate({ memberId: member.id, role: e.target.value })
                      }
                      className="h-7 border border-outline-variant bg-surface px-2 text-xs text-on-surface-variant outline-none transition-colors duration-150 focus:border-primary"
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
                            className="text-xs text-error transition-colors duration-150 hover:text-error/80"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmRemoveId(null)}
                            className="text-xs text-outline transition-colors duration-150 hover:text-on-surface-variant"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmRemoveId(member.id)}
                          className="text-xs text-error transition-colors duration-150 hover:text-error/80"
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
      </div>

      <div className="space-y-0 md:hidden">
        {members.map((member) => (
          <div key={member.id} className="border-b border-outline-variant/30 p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm text-on-surface">{member.name}</span>
              {member.role === 'owner' ? (
                <span className="inline-flex px-2 py-0.5 font-mono text-[10px] tracking-wider text-primary uppercase bg-surface-bright">
                  {member.role}
                </span>
              ) : (
                <select
                  value={member.role}
                  onChange={(e) =>
                    roleMutation.mutate({ memberId: member.id, role: e.target.value })
                  }
                  className="h-7 border border-outline-variant bg-surface px-2 text-xs text-on-surface-variant outline-none"
                >
                  <option value="admin">admin</option>
                  <option value="member">member</option>
                </select>
              )}
            </div>
            <p className="text-xs text-outline">{member.email}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-outline">
                Joined {new Date(member.joinedAt).toLocaleDateString()}
              </span>
              {member.role !== 'owner' &&
                (confirmRemoveId === member.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeMutation.mutate(member.id)}
                      className="text-xs text-error"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmRemoveId(null)}
                      className="text-xs text-outline"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmRemoveId(member.id)}
                    className="text-xs text-error"
                  >
                    Remove
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
