import {NextRequest, NextResponse} from 'next/server';
import {analyzePassword} from '@/ai/flows/password-analysis';
import {AnalyzePasswordInputSchema} from '@/ai/schemas/password-analysis-schemas';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedBody = AnalyzePasswordInputSchema.safeParse(body);

    if (!validatedBody.success) {
      return NextResponse.json(validatedBody.error.format(), {status: 400});
    }

    const result = await analyzePassword(validatedBody.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in analyze-password API route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({error: errorMessage}, {status: 500});
  }
}
