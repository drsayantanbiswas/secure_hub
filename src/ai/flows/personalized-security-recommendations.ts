'use server';
/**
 * @fileOverview A Genkit flow to provide personalized security recommendations based on a user's current security posture.
 *
 * - personalizedSecurityRecommendations - A function that returns personalized security recommendations.
 * - PersonalizedSecurityRecommendationsInput - The input type for the personalizedSecurityRecommendations function.
 * - PersonalizedSecurityRecommendationsOutput - The return type for the personalizedSecurityRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedSecurityRecommendationsInputSchema = z.object({
  passwordStrength: z.number().describe('The user\'s average password strength score (0-100).'),
  breachStatus: z
    .enum(['safe', 'atRisk'])
    .describe('The user\'s email breach status. Can be \'safe\' or \'atRisk\'.'),
  quizProgress: z
    .number()
    .describe('The user\'s progress in the security quiz, as a percentage (0-100).'),
  emailMonitoringEnabled: z
    .boolean()
    .describe('Whether the user has enabled email monitoring.'),
});
export type PersonalizedSecurityRecommendationsInput = z.infer<
  typeof PersonalizedSecurityRecommendationsInputSchema
>;

const PersonalizedSecurityRecommendationsOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('A list of personalized security recommendations.'),
});
export type PersonalizedSecurityRecommendationsOutput = z.infer<
  typeof PersonalizedSecurityRecommendationsOutputSchema
>;

export async function personalizedSecurityRecommendations(
  input: PersonalizedSecurityRecommendationsInput
): Promise<PersonalizedSecurityRecommendationsOutput> {
  return personalizedSecurityRecommendationsFlow(input);
}

const personalizedSecurityRecommendationsPrompt = ai.definePrompt({
  name: 'personalizedSecurityRecommendationsPrompt',
  input: {schema: PersonalizedSecurityRecommendationsInputSchema},
  output: {schema: PersonalizedSecurityRecommendationsOutputSchema},
  prompt: `Based on the user's current security posture, provide a list of personalized security recommendations.

Here is the user's security information:

Password Strength: {{passwordStrength}}
Breach Status: {{breachStatus}}
Quiz Progress: {{quizProgress}}%
Email Monitoring Enabled: {{emailMonitoringEnabled}}

Recommendations:`,
});

const personalizedSecurityRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedSecurityRecommendationsFlow',
    inputSchema: PersonalizedSecurityRecommendationsInputSchema,
    outputSchema: PersonalizedSecurityRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await personalizedSecurityRecommendationsPrompt(input);
    return output!;
  }
);
