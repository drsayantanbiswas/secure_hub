/**
 * @fileOverview Schemas and types for the personalized security recommendations flow.
 *
 * - PersonalizedSecurityRecommendationsInput - The input type for the personalizedSecurityRecommendations function.
 * - PersonalizedSecurityRecommendationsOutput - The return type for the personalizedSecurityRecommendations function.
 */

import {z} from 'genkit';

export const PersonalizedSecurityRecommendationsInputSchema = z.object({
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

export const PersonalizedSecurityRecommendationsOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('A list of personalized security recommendations.'),
});
export type PersonalizedSecurityRecommendationsOutput = z.infer<
  typeof PersonalizedSecurityRecommendationsOutputSchema
>;
