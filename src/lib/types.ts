export type MathCategory = 
  // Existing
  | 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed' 
  | 'algebra' | 'percentages' | 'exponents'
  // New
  | 'fractions' | 'decimals' | 'ratios' | 'square-roots' | 'order-of-operations'
  | 'area-of-squares' | 'area-of-rectangles' | 'area-of-triangles' | 'circumference' | 'pythagorean-theorem'
  | 'linear-equations' | 'quadratic-equations'
  | 'prime-numbers' | 'factors' | 'multiples' | 'roman-numerals'
  | 'mean' | 'median' | 'mode' | 'range' | 'simple-probability'
  | 'simple-interest' | 'discounts' | 'unit-conversion' | 'time-calculation'
  | 'logic-puzzles';

export type OperatorSymbol = 
  // Existing
  | '+' | '-' | '×' | '÷' | '?' | '%' | '^'
  // New
  | 'ƒ' | '.' | ':' | '√' | 'PEMDAS' | '■' | '▭' | '△' | '○' | 'a²+b²=c²'
  | 'x=' | 'x₁‚x₂' | 'P?' | 'ƒ(n)' | 'M' | 'I' | 'avg' | 'med' | 'mode' | 'R'
  | 'P(A)' | '$' | '⇔' | '⏳' | '∴';

export interface Challenge {
  numbers: number[];
  operatorSymbol: OperatorSymbol;
  question: string;
  answer: number | string; // Answer can be string for some categories e.g. Roman Numerals
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
