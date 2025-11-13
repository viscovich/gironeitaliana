
export interface Participant {
  id: number;
  name: string;
  isSeed: boolean;
}

export interface Couple {
  id: number;
  name: string;
  isSeed?: boolean;
}

export interface Match {
  couple1: Couple;
  couple2: Couple;
  score1: number | null;
  score2: number | null;
  winner: Couple | null;
  court: number;
}

export interface Round {
  roundNumber: number;
  matches: Match[];
}

export interface Standing {
  couple: Couple;
  wins: number;
  losses: number;
  gamesWon: number;
  gamesLost: number;
  gameDifference: number;
}

export type TournamentPhase = 'SETUP' | 'ROUND_ROBIN' | 'STANDINGS' | 'FINALS' | 'COMPLETE';
