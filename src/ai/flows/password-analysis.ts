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
import { z } from 'zod';

export async function analyzePassword(
  input: AnalyzePasswordInput
): Promise<AnalyzePasswordOutput> {
  return analyzePasswordFlow(input);
}

const analyzePasswordPrompt = ai.definePrompt({
  name: 'analyzePasswordPrompt',
  input: {schema: z.object({ password: z.string(), entropy: z.number() })},
  output: {schema: AnalyzePasswordOutputSchema},
  prompt: `You are an AI security expert providing password improvement recommendations 
based on modern security science (NIST 2024, entropy analysis, and attack 
vector research).

CONTEXT:
- User submitted password: '{{{password}}}'
- Current entropy: {{entropy}} bits

YOUR TASK:
Analyze the password and provide 2-3 specific, actionable recommendations 
using the following framework.

FRAMEWORK: SCIENCE-BACKED RECOMMENDATIONS

1. LENGTH IS PRIORITY (NIST 2024 Standard)
   - Minimum: 12 characters (NIST minimum)
   - Recommended: 15+ characters (NIST best practice)
   - Excellent: 20+ characters (very strong)
   
   Rule:
   IF password < 15 chars:
      Make the first priority about extending to at least 15 characters. Explain that length is the most important factor.
   
2. CHARACTER DIVERSITY (Not Forced Complexity)
   - NIST 2024: Complexity is optional, NOT required
   - Focus: Natural randomness, NOT predictable patterns
   
   Rule:
   IF missing character types:
      Recommend adding variety by mixing uppercase, lowercase, numbers, and symbols RANDOMLY. Advise against predictable positions.
   
3. PATTERN AVOIDANCE (Based on Attack Vectors)
   - Keyboard sequences (qwerty, asdf, 123456)
   - Dictionary words
   - Repeating characters (aaa, 111)
   - Predictable substitutions (a→@, e→3, l→1, o→0) - CRITICAL: ADVISE AGAINST THESE.
   - Simple patterns (Capital first + lowercase + number)

4. ENTROPY IMPROVEMENT (Mathematical Approach)
   - IF entropy < 50 bits: State that entropy is low and more random characters are needed. Aim for 70+.
   - IF entropy 50-75 bits: State it's fair, but extending to 18-20 chars would make it much stronger.
   - IF entropy > 90 bits: Congratulate the user on excellent entropy.

5. PASSPHRASE ALTERNATIVE (Modern NIST Approach)
   - As a final recommendation or alternative, suggest a passphrase of 4+ random words, like 'CorrectHorseBatteryStaple'.

CRITICAL RULES (Always follow):
1. NEVER recommend leetspeak (a→@, e→3, s→$). These are the FIRST things attackers try.
2. NEVER suggest patterns like "Capital first, number at end."
3. DO emphasize LENGTH first.
4. DO recommend RANDOMNESS and UNPREDICTABILITY.

OUTPUT STRUCTURE:
Provide recommendations as an array of objects, where each object has 'priority', 'suggestion', 'why', and 'example'.

Example output format for a password like "MyPassword123!":
[
  {
    "priority": "PRIORITY 1: Increase Length",
    "suggestion": "Extend your password to at least 15-20 characters.",
    "why": "NIST guidelines (2024) emphasize length over complexity. Each additional character exponentially increases security. Your current password could be cracked relatively quickly, but a 20-character version would take centuries.",
    "example": "'MyPassword123!' (13 chars) → 'MyPassword123VibrSky4' (20 chars)"
  },
  {
    "priority": "PRIORITY 2: Spread Characters Randomly",
    "suggestion": "Avoid placing numbers and symbols only at the end. Mix them throughout the password randomly.",
    "why": "Attackers use rules that expect patterns like 'Word+number+special'. Breaking this pattern makes automated attacks fail.",
    "example": "'MyPassword123!' → 'My3P@ssw9rdVi5brSky'"
  }
]
`,
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
        recommendations: [],
      };
    }
    const {output} = await analyzePasswordPrompt(input);
    return output!;
  }
);
