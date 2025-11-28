import { config } from 'dotenv';
config();

import '@/ai/flows/personalized-security-recommendations.ts';
import '@/ai/flows/password-analysis.ts';
import '@/ai/schemas/password-analysis-schemas.ts';
import '@/ai/schemas/personalized-security-recommendations-schemas.ts';
