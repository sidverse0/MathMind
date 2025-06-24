'use client';

import { useState, useReducer, useCallback, useEffect } from 'react';
import type { GameState, MathCategory, Challenge, PerformanceRecord } from '@/lib/types';
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
  | { type: 'SUBMIT_ANSWER'; payload: { answer: number; time: number } }
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
      const isCorrect = state.currentChallenge.answer === action.payload.answer;
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
        remainingTime: 2000, // Show result for 2s
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
      return { ...initialState, history: state.history };
    default:
      return state;
  }
}

function generateChallenge(category: MathCategory, difficulty: number): Challenge {
  const numOperands = Math.floor(difficulty / 3) + 2;
  const maxNumber = difficulty * 5 + 5;
  let numbers = Array.from({ length: numOperands }, () => Math.floor(Math.random() * maxNumber) + 1);
  let answer = 0;
  let question = '';
  let operatorSymbol: '+' | '-' | '×' | '÷' = '+';

  switch (category) {
    case 'addition':
      operatorSymbol = '+';
      answer = numbers.reduce((a, b) => a + b, 0);
      question = numbers.join(' + ');
      break;
    case 'subtraction':
      operatorSymbol = '-';
      numbers.sort((a,b) => b-a);
      answer = numbers[0] - numbers.slice(1).reduce((a, b) => a + b, 0);
      question = numbers.join(' - ');
      break;
    case 'multiplication':
      operatorSymbol = '×';
      numbers = numbers.map(n => Math.floor(n/5) > 1 ? Math.floor(n/5) : 2); // smaller numbers for multiplication
      answer = numbers.reduce((a, b) => a * b, 1);
      question = numbers.join(' × ');
      break;
    case 'division':
        operatorSymbol = '÷';
        const divisor = Math.floor(Math.random() * 5) + difficulty;
        const result = Math.floor(Math.random() * 5) + difficulty;
        const dividend = divisor * result;
        numbers = [dividend, divisor];
        answer = result;
        question = `${dividend} ÷ ${divisor}`;
        break;
  }

  return { numbers, operatorSymbol, question: `${question} = ?`, answer };
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
    dispatch({ type: 'SUBMIT_ANSWER', payload: { answer: parseInt(answer, 10), time: timeTaken } });
  }, [state.startTime]);

  useEffect(() => {
    if (state.phase === 'config' || state.phase === 'solve' && state.remainingTime <= 0) return;

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
