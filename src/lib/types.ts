export type MathCategory = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed';

export interface Challenge {
  numbers: number[];
  operatorSymbol: '+' | '-' | '×' | '÷';
  question: string;
  answer: number;
}

export interface PerformanceRecord {
  correct: boolean;
  time: number;
  difficulty: number;
}

export interface GameState {
  phase: 'config' | 'memorize' | 'solve' | 'result';
  category: MathCategory;
  difficulty: number;
  score: number;
  coins: number;
  currentChallenge: Challenge | null;
  startTime: number;
  history: PerformanceRecord[];
  feedback: '' | 'correct' | 'incorrect' | 'timeup';
  remainingTime: number;
  memorizeDuration: number;
  solveDuration: number;
}
