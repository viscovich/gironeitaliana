import { Couple, Round, Match } from '../types';

export const generateRoundRobinSchedule = (couples: Couple[]): Round[] => {
  if (couples.length !== 6) {
    return [];
  }

  const schedule: Round[] = [];
  const teams = [...couples];
  
  const numRounds = 5;
  const numTeams = teams.length;

  const fixedTeam = teams[numTeams - 1];
  let rotatingTeams = teams.slice(0, numTeams - 1);

  for (let round = 0; round < numRounds; round++) {
    const roundMatches: Match[] = [];

    // Match for the fixed team
    const opponentForFixed = rotatingTeams[0];
    roundMatches.push({
      couple1: fixedTeam,
      couple2: opponentForFixed,
      score1: null,
      score2: null,
      winner: null,
      court: 1,
    });

    // Other matches
    const numRotating = rotatingTeams.length; // 5
    for (let i = 1; i <= numRotating / 2; i++) { // i will be 1, 2
      const team1 = rotatingTeams[i];
      const team2 = rotatingTeams[numRotating - i];
      roundMatches.push({
        couple1: team1,
        couple2: team2,
        score1: null,
        score2: null,
        winner: null,
        court: i + 1,
      });
    }

    schedule.push({
      roundNumber: round + 1,
      matches: roundMatches,
    });

    // Rotate the teams for the next round
    const lastTeam = rotatingTeams.pop()!;
    rotatingTeams.unshift(lastTeam);
  }

  return schedule;
};