import {NextRequest, NextResponse} from 'next/server';
import {personalizedSecurityRecommendations} from '@/ai/flows/personalized-security-recommendations';
import {PersonalizedSecurityRecommendationsInputSchema} from '@/ai/schemas/personalized-security-recommendations-schemas';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedBody =
      PersonalizedSecurityRecommendationsInputSchema.safeParse(body);

    if (!validatedBody.success) {
      return NextResponse.json(validatedBody.error.format(), {status: 400});
    }

    const result = await personalizedSecurityRecommendations(validatedBody.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in personalized-security-recommendations API route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({error: errorMessage}, {status: 500});
  }
}
