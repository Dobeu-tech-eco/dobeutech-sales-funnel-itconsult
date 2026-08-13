import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');

    // Parse pagination parameters with safe fallbacks to prevent NaN queries
    let limit = 50;
    if (limitParam) {
      const parsedLimit = parseInt(limitParam, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        limit = Math.min(parsedLimit, 100); // Cap at 100 to prevent DoS
      }
    }

    const MAX_OFFSET = 10_000;

    let offset = 0;
    if (offsetParam) {
      const parsedOffset = parseInt(offsetParam, 10);
      if (!isNaN(parsedOffset) && parsedOffset >= 0) {
        offset = Math.min(parsedOffset, MAX_OFFSET);
      }
    }

    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
      throw new Error('DATABASE_URL is not configured');
    }

    const sql = neon(dbUrl);
    const rows = await sql`SELECT * FROM survey_responses ORDER BY submitted_at DESC LIMIT ${limit} OFFSET ${offset}`;

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Failed to get survey responses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch survey responses' },
      { status: 500 }
    );
  }
}
