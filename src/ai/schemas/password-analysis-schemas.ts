/**
 * @fileOverview Schemas and types for the password analysis flow.
 *
 * - AnalyzePasswordInput - The input type for the analyzePassword function.
 * - AnalyzePasswordOutput - The return type for the analyzePassword function.
 */

import {z} from 'genkit';

export const AnalyzePasswordInputSchema = z.object({
  password: z.string().describe('The password to be analyzed.'),
});
export type AnalyzePasswordInput = z.infer<typeof AnalyzePasswordInputSchema>;

export const AnalyzePasswordOutputSchema = z.object({
  predictablePatterns: z
    .array(
      z.object({
        patternType: z
          .enum([
            'dates',
            'commonWords',
            'keyboardSequences',
            'repeatedSequences',
            'personalInfo',
          ])
          .describe('The type of predictable pattern found.'),
        segment: z.string().describe('The segment of the password that matches the pattern.'),
        details: z.string().describe('Details about why this pattern is weak.'),
      })
    )
    .describe('A list of predictable patterns found in the password.'),
  commonAttackTechniques: z
    .array(
      z.object({
        technique: z
          .enum([
            'dictionaryAttack',
            'bruteForce',
            'credentialStuffing',
            'ruleBasedAttack',
          ])
          .describe('The attack technique.'),
        vulnerability: z
          .string()
          .describe('How the password is vulnerable to this technique.'),
      })
    )
    .describe(
      'A list of common attack techniques the password might be vulnerable to.'
    ),
  improvementSuggestion: z
    .string()
    .describe(
      'A specific, actionable suggestion for how to improve the password.'
    ),
});
export type AnalyzePasswordOutput = z.infer<typeof AnalyzePasswordOutputSchema>;
