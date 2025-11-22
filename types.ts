export interface Champion {
  id: string;
  name: string;
  image: string;
}

export interface CounterItem {
  name: string;
  explanation: string;
}

export interface MatchupAdvice {
  summary: string;
  
  // New: Pathing & Aggression
  firstClearPath: string;
  invadeDecision: 'invade' | 'defend' | 'farm'; 
  invadeExplanation: string;

  // Phases
  earlyGame: string;
  earlyGameAdvantage: 'me' | 'enemy' | 'even';
  
  // New: Objectives
  objectiveControl: 'me' | 'enemy' | 'even';
  objectiveExplanation: string;

  // Scaling & Teamfight
  powerSpikes: string;
  midLateGame: string;
  midLateGameAdvantage: 'me' | 'enemy' | 'even';
  teamfightRole: string; // New: "Engage", "Assassin", etc.

  // Mechanics & Items
  keyMechanic: string; // General playstyle
  specificInteraction: string; // New: Specific ability interaction
  counterItems: CounterItem[];

  // Grounding
  sources?: { title: string; uri: string }[];
}

export type ChampionSelectionDetails = {
  champion: Champion | null;
  side: 'player' | 'enemy';
};