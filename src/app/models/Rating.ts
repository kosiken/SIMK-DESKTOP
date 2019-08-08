import Conference from './Conference';
export interface Rating {
  attack: number;
  defense: number;
  rebound: number;
  steal: number;
  inside: number;
  outside: number;
  passing: number;
  block: number;
}

export interface BoxScore {
  player: string;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  mins: number;
  PER: number;
}

export interface Stats {
  PPG: number;
  RPG: number;
  APG: number;
  SPG: number;
  BPG: number;
  PER: number;
}

export interface Ratings {
  attack: number;
  defense: number;
}

export interface BoxScores {
  home: BoxScore[];
  away: BoxScore[];
}
export interface Score {
  home: number;
  away: number;
}
export interface ConferenceObj {
  Western: Conference;
  Eastern: Conference;
}

export interface Tendencies {
  inside: number;
  outside: number;
  passing: number;
}
