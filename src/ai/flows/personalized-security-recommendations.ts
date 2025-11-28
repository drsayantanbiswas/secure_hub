'use server';
/**
 * @fileOverview A Genkit flow to provide personalized security recommendations based on a user's current security posture.
 *
 * - personalizedSecurityRecommendations - A function that returns personalized security recommendations.
 */

import {ai} from '@/ai/genkit';
import {
  PersonalizedSecurityRecommendationsInputSchema,
  PersonalizedSecurityRecommendationsOutputSchema,
  type PersonalizedSecurityRecommendationsInput,
  type PersonalizedSecurityRecommendationsOutput,
} from '@/ai/schemas/personalized-security-recommendations-schemas';

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
