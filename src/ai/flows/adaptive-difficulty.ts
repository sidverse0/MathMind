// src/ai/flows/adaptive-difficulty.ts
'use server';
/**
 * @fileOverview A flow that dynamically adjusts the difficulty of math challenges based on user performance.
 *
 * - adjustDifficulty - A function that adjusts the difficulty level based on user accuracy and time.
 * - AdjustDifficultyInput - The input type for the adjustDifficulty function.
 * - AdjustDifficultyOutput - The return type for the adjustDifficulty function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustDifficultyInputSchema = z.object({
  accuracy: z
    .number()
    .describe('The accuracy of the user in the last few challenges (0 to 1).'),
  averageTime: z
    .number()
    .describe('The average time taken by the user to solve the last few challenges in seconds.'),
  currentDifficulty: z
    .number()
    .describe('The current difficulty level of the game (e.g., 1-10).'),
});
export type AdjustDifficultyInput = z.infer<typeof AdjustDifficultyInputSchema>;

const AdjustDifficultyOutputSchema = z.object({
  newDifficulty: z
    .number()
    .describe('The new difficulty level of the game, adjusted based on performance.'),
  reason: z
    .string()
    .describe('The reasoning behind the difficulty adjustment.'),
});
export type AdjustDifficultyOutput = z.infer<typeof AdjustDifficultyOutputSchema>;

export async function adjustDifficulty(input: AdjustDifficultyInput): Promise<AdjustDifficultyOutput> {
  return adjustDifficultyFlow(input);
}

const adjustDifficultyPrompt = ai.definePrompt({
  name: 'adjustDifficultyPrompt',
  input: {schema: AdjustDifficultyInputSchema},
  output: {schema: AdjustDifficultyOutputSchema},
  prompt: `You are an AI game master tasked with adjusting the difficulty of a math game.

  Based on the user's recent performance, you should adjust the difficulty level to keep the game engaging.
  If the user is performing well (high accuracy, low time), increase the difficulty.
  If the user is struggling (low accuracy, high time), decrease the difficulty.
  Otherwise, maintain the current difficulty.

  Current Difficulty: {{{currentDifficulty}}}
  Accuracy: {{{accuracy}}}
  Average Time: {{{averageTime}}} seconds

  Consider these factors when determining the new difficulty:
  - A difficulty should be between 1 and 10.
  - Increments and decrements in difficulty should be small (1-2 levels at a time).

  Return the new difficulty and a brief explanation of why the difficulty was adjusted.
  Ensure the returned object conforms to the schema exactly.`,
});

const adjustDifficultyFlow = ai.defineFlow(
  {
    name: 'adjustDifficultyFlow',
    inputSchema: AdjustDifficultyInputSchema,
    outputSchema: AdjustDifficultyOutputSchema,
  },
  async input => {
    const {output} = await adjustDifficultyPrompt(input);
    return output!;
  }
);
