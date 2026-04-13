import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTeams, type Team } from '../api/teams';

interface TeamState {
  teams: Team[];
  currentTeam: Team | null;
  setCurrentTeam: (team: Team) => void;
  isLoading: boolean;
}

export const TeamContext = createContext<TeamState | null>(null);

export function useTeam(): TeamState {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error('useTeam must be used within TeamProvider');
  return ctx;
}

export function useTeamProvider(isAuthenticated: boolean): TeamState {
  const [currentTeam, setCurrentTeamState] = useState<Team | null>(null);

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: getTeams,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (teams.length > 0 && !currentTeam) {
      setCurrentTeamState(teams[0]!);
    }
  }, [teams, currentTeam]);

  const setCurrentTeam = useCallback((team: Team) => {
    setCurrentTeamState(team);
  }, []);

  return { teams, currentTeam, setCurrentTeam, isLoading };
}
