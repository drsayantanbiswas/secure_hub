/**
 * @fileOverview Schemas and types for the password analysis flow.
 *
 * - AnalyzePasswordInput - The input type for the analyzePassword function.
 * - AnalyzePasswordOutput - The return type for the analyzePassword function.
 */

import {z} from 'genkit';

export const AnalyzePasswordInputSchema = z.object({
  password: z.string().describe('The password to be analyzed.'),
  entropy: z.number().describe('The calculated entropy of the password in bits.')
});
export type AnalyzePasswordInput = z.infer<typeof AnalyzePasswordInputSchema>;

export const AnalyzePasswordOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      priority: z.string().describe("The priority level of the recommendation, e.g., 'PRIORITY 1: Increase Length'"),
      suggestion: z.string().describe("A specific, actionable recommendation."),
      why: z.string().describe("An explanation of why the suggestion improves security."),
      example: z.string().describe("An example of how to apply the recommendation, showing a before and after if possible."),
    })
  ).describe('A list of science-backed recommendations to improve the password.')
});
export type AnalyzePasswordOutput = z.infer<typeof AnalyzePasswordOutputSchema>;
