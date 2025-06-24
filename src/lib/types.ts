export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type PowerUpType = 'extraTime' | 'mistakeShield' | 'numberReveal';

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
  | 'logic-puzzles'
  // Newly Added
  | 'sine' | 'cosine' | 'tangent'
  | 'basic-derivatives' | 'basic-integrals'
  | 'logarithms' | 'polynomial-addition' | 'polynomial-subtraction' | 'inequalities'
  | 'volume-cube' | 'volume-sphere' | 'volume-cylinder' | 'distance-formula' | 'slope-formula'
  | 'permutations' | 'combinations' | 'set-union' | 'set-intersection' | 'factorial'
  | 'compound-interest' | 'sales-tax';

export type OperatorSymbol = 
  // Existing
  | '+' | '-' | '×' | '÷' | '?' | '%' | '^'
  // New
  | 'ƒ' | '.' | ':' | '√' | 'PEMDAS' | '■' | '▭' | '△' | '○' | 'a²+b²=c²'
  | 'x=' | 'x₁‚x₂' | 'P?' | 'ƒ(n)' | 'M' | 'I' | 'avg' | 'med' | 'mode' | 'R'
  | 'P(A)' | '$' | '⇔' | '⏳' | '∴'
  // Newly Added
  | 'sin' | 'cos' | 'tan'
  | 'd/dx' | '∫'
  | 'log' | 'P(x)+Q(x)' | 'P(x)-Q(x)' | '<'
  | 'V³' | 'V⨁' | 'V▭' | '↔' | 'm'
  | 'P(n,k)' | 'C(n,k)' | '∪' | '∩' | '!'
  | 'CI' | 'tax';


export interface Challenge {
  numbers: number[];
  operatorSymbol: OperatorSymbol;
  question: string;
  answer: number | string; // Answer can be string for some categories e.g. Roman Numerals
  options: (number | string)[];
}

export interface PerformanceRecord {
  correct: boolean;
  time: number;
  difficulty: number;
}

export interface GameState {
  phase: 'config' | 'pre-config' | 'memorize' | 'solve' | 'result' | 'summary' | 're-memorize';
  category: MathCategory | null;
  difficultyLevel: DifficultyLevel;
  difficulty: number; // 1-10
  totalQuestions: number;
  currentQuestionIndex: number;
  score: number;
  coins: number;
  currentChallenge: Challenge | null;
  startTime: number;
  history: PerformanceRecord[];
  feedback: '' | 'correct' | 'incorrect' | 'timeup' | 'shielded';
  remainingTime: number;
  memorizeDuration: number;
  solveDuration: number;
  isShieldActive: boolean;
}
