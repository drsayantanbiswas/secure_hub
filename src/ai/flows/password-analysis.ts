'use server';
/**
 * @fileOverview A Genkit flow to provide an in-depth analysis of a password's strength.
 *
 * - analyzePassword - A function that returns a detailed analysis of a password.
 */

import {ai} from '@/ai/genkit';
import {
  AnalyzePasswordInputSchema,
  AnalyzePasswordOutputSchema,
  type AnalyzePasswordInput,
  type AnalyzePasswordOutput,
} from '@/ai/schemas/password-analysis-schemas';

export async function analyzePassword(
  input: AnalyzePasswordInput
): Promise<AnalyzePasswordOutput> {
  return analyzePasswordFlow(input);
}

const analyzePasswordPrompt = ai.definePrompt({
  name: 'analyzePasswordPrompt',
  input: {schema: AnalyzePasswordInputSchema},
  output: {schema: AnalyzePasswordOutputSchema},
  prompt: `You are a cybersecurity expert specializing in password strength analysis. Analyze the provided password for weaknesses.

Password: '{{{password}}}'

Your analysis should identify:
1.  **Predictable Patterns**: Look for common words, dates (like 1990, 2024), keyboard sequences (like 'qwerty', 'asdf'), repeated character sequences (like 'aaa', '111'), or patterns that look like personal information (names, birth years).
2.  **Vulnerabilities to Common Attacks**: Based on its structure, determine which common attack techniques (like dictionary attacks, brute force, credential stuffing) it would be most vulnerable to and briefly explain why.
3.  **Improvement Suggestion**: Provide one single, actionable tip to make this specific password stronger. For example, "replace 'e' with '3' and add a special character at the end." or "break up the common word 'password' with numbers or symbols."

Do not provide a full new password, just a suggestion for improvement. Be concise. If the password is very strong, state that it has no obvious predictable patterns and is resilient against common attacks, and suggest a minor variation as an improvement.`,
});

const analyzePasswordFlow = ai.defineFlow(
  {
    name: 'analyzePasswordFlow',
    inputSchema: AnalyzePasswordInputSchema,
    outputSchema: AnalyzePasswordOutputSchema,
  },
  async input => {
    if (!input.password) {
      return {
        predictablePatterns: [],
        commonAttackTechniques: [],
        improvementSuggestion: 'Enter a password to analyze its strength.',
      };
    }
    const {output} = await analyzePasswordPrompt(input);
    return output!;
  }
);
