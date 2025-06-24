'use client';

import { useState, useReducer, useCallback, useEffect } from 'react';
import type { GameState, MathCategory, Challenge, PerformanceRecord, OperatorSymbol } from '@/lib/types';
import { adjustDifficulty } from '@/ai/flows/adaptive-difficulty';
import { useToast } from '@/hooks/use-toast';

const initialState: GameState = {
  phase: 'config',
  category: 'addition',
  difficulty: 1,
  score: 0,
  coins: 0,
  currentChallenge: null,
  startTime: 0,
  history: [],
  feedback: '',
  remainingTime: 0,
  memorizeDuration: 3000,
  solveDuration: 10000,
};

type GameAction =
  | { type: 'SET_CATEGORY'; payload: MathCategory }
  | { type: 'START_GAME' }
  | { type: 'START_SOLVE' }
  | { type: 'SUBMIT_ANSWER'; payload: { answer: string; time: number } }
  | { type: 'TICK'; payload: number }
  | { type: 'SET_DIFFICULTY'; payload: number }
  | { type: 'RESET' };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_CATEGORY':
      return { ...state, category: action.payload };
    case 'START_GAME': {
      const challenge = generateChallenge(state.category, state.difficulty);
      return {
        ...initialState,
        category: state.category,
        difficulty: state.difficulty,
        history: state.history,
        score: state.score,
        coins: state.coins,
        phase: 'memorize',
        currentChallenge: challenge,
        remainingTime: state.memorizeDuration,
      };
    }
    case 'START_SOLVE':
      return {
        ...state,
        phase: 'solve',
        startTime: Date.now(),
        remainingTime: state.solveDuration,
      };
    case 'SUBMIT_ANSWER': {
      if (!state.currentChallenge) return state;
      const isCorrect = String(state.currentChallenge.answer).toLowerCase() === action.payload.answer.toLowerCase();
      const scoreGained = isCorrect ? state.difficulty * 10 : 0;
      const coinsGained = isCorrect ? state.difficulty : 0;
      const newHistory: PerformanceRecord[] = [...state.history, { correct: isCorrect, time: action.payload.time, difficulty: state.difficulty }];
      return {
        ...state,
        phase: 'result',
        score: state.score + scoreGained,
        coins: state.coins + coinsGained,
        feedback: isCorrect ? 'correct' : 'incorrect',
        history: newHistory,
        remainingTime: 2000,
      };
    }
    case 'TICK': {
      const newTime = state.remainingTime - action.payload;
      if (newTime <= 0) {
        if (state.phase === 'memorize') return { ...gameReducer(state, { type: 'START_SOLVE' }) };
        if (state.phase === 'solve') return { ...state, phase: 'result', feedback: 'timeup', remainingTime: 2000 };
        if (state.phase === 'result') return { ...gameReducer(state, { type: 'START_GAME' }) };
      }
      return { ...state, remainingTime: newTime };
    }
    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.payload };
    case 'RESET':
      return { ...initialState, history: state.history, score: state.score, coins: state.coins };
    default:
      return state;
  }
}

function generateChallenge(category: MathCategory, difficulty: number): Challenge {
  let currentCategory = category;
  if (category === 'mixed') {
    const categories: MathCategory[] = ['addition', 'subtraction', 'multiplication', 'division', 'algebra', 'percentages', 'exponents'];
    currentCategory = categories[Math.floor(Math.random() * categories.length)];
  }

  const numOperands = Math.floor(difficulty / 3) + 2;
  let maxNumber = difficulty * 5 + 5;
  let numbers = Array.from({ length: numOperands }, () => Math.floor(Math.random() * maxNumber) + 1);
  let answer: string | number = 0;
  let question = '';
  let operatorSymbol: OperatorSymbol = '+';

  const d = difficulty; // alias for difficulty
  const rand = (max: number, min = 1) => Math.floor(Math.random() * (max - min + 1)) + min;
  const toFixed = (num: number) => parseFloat(num.toFixed(2));

  switch (currentCategory) {
    case 'addition':
      operatorSymbol = '+';
      answer = numbers.reduce((a, b) => a + b, 0);
      question = numbers.join(' + ');
      break;
    case 'subtraction':
      operatorSymbol = '-';
      numbers.sort((a,b) => b-a);
      numbers[0] = numbers[0] + numbers.slice(1).reduce((a,b) => a+b, 0); // ensure positive result
      answer = numbers[0] - numbers.slice(1).reduce((a, b) => a + b, 0);
      question = numbers.join(' - ');
      break;
    case 'multiplication':
      operatorSymbol = '×';
      numbers = numbers.map(n => Math.floor(n/(d+1)) > 1 ? Math.floor(n/(d+1)) : rand(d+1, 2));
      answer = numbers.reduce((a, b) => a * b, 1);
      question = numbers.join(' × ');
      break;
    case 'division':
        operatorSymbol = '÷';
        const divisor = rand(5) + d;
        const result = rand(5) + d;
        const dividend = divisor * result;
        numbers = [dividend, divisor];
        answer = result;
        question = `${dividend} ÷ ${divisor}`;
        break;
    case 'algebra': {
        operatorSymbol = '?';
        const num1 = rand(d * 10);
        const num2 = rand(d * 5);
        const res = num1 + num2;
        numbers = [num1, res];
        answer = num2;
        question = `${num1} + x = ${res}`;
        break;
    }
    case 'percentages': {
        operatorSymbol = '%';
        const pValues = [10, 20, 25, 50, 75];
        const p = pValues[rand(pValues.length-1, 0)];
        const base = rand(d) * (100 / p);
        numbers = [p, base];
        answer = (p / 100) * base;
        question = `${p}% of ${base}`;
        break;
    }
    case 'exponents': {
        operatorSymbol = '^';
        const base = rand(Math.floor(d / 2) + 2, 2);
        const exponent = rand(Math.floor(d / 3) + 2, 2);
        numbers = [base, exponent];
        answer = Math.pow(base, exponent);
        question = `${base} ^ ${exponent}`;
        break;
    }
    case 'fractions': {
      operatorSymbol = 'ƒ';
      const den1 = rand(d + 2, 2);
      const den2 = rand(d + 2, 2);
      const num1 = rand(den1 - 1);
      const num2 = rand(den2 - 1);
      numbers = [num1, den1, num2, den2];
      answer = toFixed(num1 / den1 + num2 / den2);
      question = `${num1}/${den1} + ${num2}/${den2}`;
      break;
    }
    case 'decimals': {
      operatorSymbol = '.';
      const dec1 = rand(d * 10) / 10;
      const dec2 = rand(d * 10) / 10;
      numbers = [dec1, dec2];
      answer = toFixed(dec1 + dec2);
      question = `${dec1} + ${dec2}`;
      break;
    }
    case 'ratios': {
      operatorSymbol = ':';
      const r1 = rand(d + 1);
      const mult = rand(d + 1, 2);
      const r2 = r1 * mult;
      const r3 = rand(d + 1);
      const r4 = r3 * mult;
      numbers = [r1, r2, r3];
      answer = r4;
      question = `${r1}:${r2} = ${r3}:x`;
      break;
    }
    case 'square-roots': {
      operatorSymbol = '√';
      const base = rand(d + 3);
      const num = base * base;
      numbers = [num];
      answer = base;
      question = `√${num}`;
      break;
    }
    case 'order-of-operations': {
      operatorSymbol = 'PEMDAS';
      const n1 = rand(d + 2);
      const n2 = rand(d + 2);
      const n3 = rand(d + 2, 2);
      numbers = [n1, n2, n3];
      answer = n1 + n2 * n3;
      question = `${n1} + ${n2} × ${n3}`;
      break;
    }
    case 'area-of-squares': {
      operatorSymbol = '■';
      const side = rand(d + 5);
      numbers = [side];
      answer = side * side;
      question = `Area of square with side ${side}`;
      break;
    }
    case 'area-of-rectangles': {
      operatorSymbol = '▭';
      const w = rand(d + 5);
      const h = rand(d + 5);
      numbers = [w, h];
      answer = w * h;
      question = `Area of ${w}x${h} rectangle`;
      break;
    }
    case 'area-of-triangles': {
      operatorSymbol = '△';
      const b = rand(d + 5) * 2;
      const h = rand(d + 5);
      numbers = [b, h];
      answer = (b * h) / 2;
      question = `Area of triangle with base ${b} and height ${h}`;
      break;
    }
    case 'circumference': {
      operatorSymbol = '○';
      const radius = rand(d + 2);
      numbers = [radius];
      answer = toFixed(2 * Math.PI * radius);
      question = `Circumference of circle with radius ${radius} (π≈3.14)`;
      break;
    }
    case 'pythagorean-theorem': {
      operatorSymbol = 'a²+b²=c²';
      const a = rand(d + 2);
      const b = rand(d + 2, a + 1);
      numbers = [a, b];
      answer = toFixed(Math.sqrt(a * a + b * b));
      question = `Hypotenuse for sides ${a} and ${b}`;
      break;
    }
    case 'linear-equations': {
      operatorSymbol = 'x=';
      const a = rand(d, 2);
      const x = rand(d + 1);
      const b = rand(d * 5);
      const c = a * x + b;
      numbers = [a, b, c];
      answer = x;
      question = `${a}x + ${b} = ${c}`;
      break;
    }
    case 'quadratic-equations': {
        operatorSymbol = 'x₁‚x₂';
        const r1 = rand(d, -d);
        const r2 = rand(d, -d);
        numbers = [r1,r2];
        const b = -(r1+r2);
        const c = r1*r2;
        const bSign = b >= 0 ? '+' : '-';
        const cSign = c >= 0 ? '+' : '-';
        question = `x² ${bSign} ${Math.abs(b)}x ${cSign} ${Math.abs(c)} = 0`;
        answer = `${Math.min(r1,r2)},${Math.max(r1,r2)}`;
        break;
    }
    case 'prime-numbers': {
      operatorSymbol = 'P?';
      const num = rand(d * 10);
      numbers = [num];
      let isPrime = true;
      if (num <= 1) isPrime = false;
      for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) {
          isPrime = false;
          break;
        }
      }
      answer = isPrime ? '1' : '0';
      question = `Is ${num} a prime number? (1 for yes, 0 for no)`;
      break;
    }
    case 'factors': {
      operatorSymbol = 'ƒ(n)';
      const n1 = rand(d + 2, 2);
      const n2 = rand(d + 2, 2);
      const num = n1 * n2;
      numbers = [num];
      answer = n1; // any factor is fine
      question = `Give one factor of ${num} (other than 1 and ${num})`;
      break;
    }
    case 'multiples': {
      operatorSymbol = 'M';
      const n1 = rand(d + 5, 2);
      const n2 = rand(5, 2);
      numbers = [n1, n2];
      answer = n1 * n2;
      question = `What is the ${n2}th multiple of ${n1}?`;
      break;
    }
    case 'roman-numerals': {
        operatorSymbol = 'I';
        const num = rand(d*5 + 5);
        numbers = [num];
        const romanMap: {[key: string]: number} = {M:1000, CM:900, D:500, CD:400, C:100, XC:90, L:50, XL:40, X:10, IX:9, V:5, IV:4, I:1};
        let result = '';
        let n = num;
        for (const key in romanMap) {
            while (n >= romanMap[key]) {
                result += key;
                n -= romanMap[key];
            }
        }
        answer = result;
        question = `Convert ${num} to Roman numerals`;
        break;
    }
    case 'mean': {
      operatorSymbol = 'avg';
      numbers = Array.from({length: d+2}, () => rand(d*5));
      const sum = numbers.reduce((a,b) => a+b, 0);
      answer = toFixed(sum / numbers.length);
      question = `Mean of ${numbers.join(', ')}`;
      break;
    }
    case 'median': {
      operatorSymbol = 'med';
      numbers = Array.from({length: d%2 === 0 ? d+3 : d+2}, () => rand(d*5));
      numbers.sort((a,b)=>a-b);
      const mid = Math.floor(numbers.length / 2);
      answer = numbers.length % 2 !== 0 ? numbers[mid] : (numbers[mid-1] + numbers[mid]) / 2;
      question = `Median of these numbers`;
      break;
    }
    case 'mode': {
        operatorSymbol = 'mode';
        const modeNum = rand(d * 5);
        numbers = Array.from({length: d+2}, () => rand(d*5));
        numbers.splice(rand(numbers.length-1,0), 0, modeNum);
        numbers.splice(rand(numbers.length-1,0), 0, modeNum);
        answer = modeNum;
        question = `Find the mode in these numbers`;
        break;
    }
    case 'range': {
      operatorSymbol = 'R';
      numbers = Array.from({length: d+2}, () => rand(d*5));
      const min = Math.min(...numbers);
      const max = Math.max(...numbers);
      answer = max - min;
      question = `Range of these numbers`;
      break;
    }
    case 'simple-probability': {
        operatorSymbol = 'P(A)';
        const total = rand(d*2, 5);
        const favorable = rand(total-1);
        numbers = [favorable, total];
        answer = toFixed(favorable/total);
        question = `Probability: ${favorable} out of ${total}`;
        break;
    }
    case 'simple-interest': {
        operatorSymbol = '$';
        const principal = rand(d*50, 50);
        const rate = rand(10, 2);
        const time = rand(5, 1);
        numbers = [principal, rate, time];
        answer = principal * (rate/100) * time;
        question = `Simple interest on $${principal} at ${rate}% for ${time} year(s)`;
        break;
    }
    case 'discounts': {
        operatorSymbol = '$';
        const price = rand(d*20, 10);
        const discount = rand(5,2)*10;
        numbers = [price, discount];
        answer = toFixed(price * (1 - discount/100));
        question = `${discount}% off of $${price}`;
        break;
    }
    case 'unit-conversion': {
        operatorSymbol = '⇔';
        const val = rand(d*5);
        numbers = [val];
        answer = val * 1000;
        question = `Convert ${val} kilometers to meters`;
        break;
    }
    case 'time-calculation': {
        operatorSymbol = '⏳';
        const hours = rand(12);
        const minutes = rand(59);
        const addMinutes = rand(120, 15);
        numbers = [hours, minutes, addMinutes];
        const newTotalMinutes = (hours * 60 + minutes + addMinutes) % (24 * 60);
        const newHours = Math.floor(newTotalMinutes / 60);
        const newMinutes = newTotalMinutes % 60;
        answer = `${newHours}:${String(newMinutes).padStart(2, '0')}`;
        question = `What time is it ${addMinutes} minutes after ${hours}:${String(minutes).padStart(2, '0')}? (HH:MM)`;
        break;
    }
    case 'logic-puzzles': {
        operatorSymbol = '∴';
        const start = rand(d*2);
        const step = rand(d, 2);
        numbers = [start, start + step, start + 2*step];
        answer = start + 3*step;
        question = `What's the next number in the sequence: ${numbers.join(', ')}, ...`;
        break;
    }
  }

  // Generate options for multiple choice
    const options: (string | number)[] = [answer];
    if (currentCategory === 'prime-numbers') {
        options.push(answer === '1' ? '0' : '1');
    } else {
        const answerNum = Number(answer);
        if (!isNaN(answerNum)) { // Is a number
            const distractors: Set<number | string> = new Set();
            const isFloat = String(answer).includes('.');
            
            while(distractors.size < 3) {
                const variation = Math.max(1, Math.ceil(Math.abs(answerNum * 0.2))) + difficulty + 2;
                const offset = Math.floor(Math.random() * variation) + 1;
                const plusOrMinus = Math.random() < 0.5 ? -1 : 1;
                let distractor = answerNum + (offset * plusOrMinus);
                
                if (isFloat) {
                    distractor = parseFloat(distractor.toFixed(2));
                } else {
                    distractor = Math.round(distractor);
                }
                
                if (distractor !== answer) {
                    distractors.add(distractor);
                }
            }
            options.push(...distractors);
        } else { // Is a string but not 'prime-numbers'
            const baseString = String(answer).replace(/[^a-zA-Z0-9]/g, '').slice(0, 3);
            options.push(baseString + 'x', baseString + 'y', baseString + 'z');
        }
    }

    // Ensure uniqueness and correct length, then shuffle
    let finalOptions = [...new Set(options)];
    if(finalOptions.length > 1 && finalOptions.length < 4) {
        while(finalOptions.length < 4) {
            finalOptions.push(Number(finalOptions[0]) + finalOptions.length + difficulty * 2);
        }
    }
    
    finalOptions = finalOptions
        .filter(opt => opt !== answer)
        .slice(0, 3);
    finalOptions.push(answer);
    finalOptions = [...new Set(finalOptions)];
     while (finalOptions.length < 4 && currentCategory !== 'prime-numbers') {
        finalOptions.push(String(finalOptions[0]).length + finalOptions.length + difficulty * 3);
        finalOptions = [...new Set(finalOptions)];
    }


  return { numbers, operatorSymbol, question: `${question} = ?`, answer, options: finalOptions.sort(() => Math.random() - 0.5).slice(0, 4) };
}

export const useGame = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { toast } = useToast();

  const setCategory = useCallback((category: MathCategory) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
  }, []);

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);
  
  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const submitAnswer = useCallback((answer: string) => {
    const timeTaken = Date.now() - state.startTime;
    dispatch({ type: 'SUBMIT_ANSWER', payload: { answer, time: timeTaken } });
  }, [state.startTime]);

  useEffect(() => {
    if (state.phase === 'config' || state.remainingTime <= 0) return;

    const timer = setInterval(() => {
      dispatch({ type: 'TICK', payload: 100 });
    }, 100);

    return () => clearInterval(timer);
  }, [state.phase, state.remainingTime]);
  
  useEffect(() => {
    if (state.history.length > 0 && state.history.length % 5 === 0 && state.phase === 'result') {
      const recentHistory = state.history.slice(-5);
      const accuracy = recentHistory.filter(h => h.correct).length / recentHistory.length;
      const averageTime = recentHistory.reduce((acc, h) => acc + h.time, 0) / recentHistory.length / 1000;
      
      adjustDifficulty({
        accuracy,
        averageTime,
        currentDifficulty: state.difficulty
      }).then(res => {
        const newDifficulty = Math.max(1, Math.min(10, res.newDifficulty));
        if(newDifficulty !== state.difficulty) {
            dispatch({ type: 'SET_DIFFICULTY', payload: newDifficulty });
            toast({
                title: "Difficulty Adjusted!",
                description: `${res.reason} New difficulty: ${newDifficulty}.`,
            });
        }
      }).catch(err => {
        console.error("Failed to adjust difficulty", err);
        toast({
            variant: "destructive",
            title: "AI Error",
            description: "Could not adjust difficulty.",
        });
      });
    }
  }, [state.history, state.phase, state.difficulty, toast]);

  return { state, setCategory, startGame, submitAnswer, resetGame };
};
