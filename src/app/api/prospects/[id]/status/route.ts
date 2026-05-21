import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { z } from 'zod';

const statusSchema = z.enum([
  'DISCOVERED', 'ENRICHED', 'QUEUED', 'CONTACTED', 'REPLIED',
  'SURVEY_SENT', 'SURVEY_COMPLETE', 'MEETING_BOOKED', 'CLIENT',
  'UNSUBSCRIBED', 'BOUNCED', 'NOT_FIT'
]);

const idSchema = z.string().cuid();

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;

    // Validate ID
    const idResult = idSchema.safeParse(params.id);
    if (!idResult.success) {
      return NextResponse.json({ error: 'Invalid prospect ID format' }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    // Validate Status
    const statusResult = statusSchema.safeParse(status);
    if (!statusResult.success) {
      return NextResponse.json({ error: 'Invalid status provided' }, { status: 400 });
    }

    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
      throw new Error('DATABASE_URL is not configured');
    }

    const sql = neon(dbUrl);

    await sql`UPDATE prospects SET status = ${status}, updated_at = NOW() WHERE id = ${params.id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update prospect status:', error);
    return NextResponse.json(
      { error: 'Failed to update prospect status' },
      { status: 500 }
    );
  }
}
