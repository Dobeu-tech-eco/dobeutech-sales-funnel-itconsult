import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BEARER_PREFIX = 'Bearer ';

// Middleware runs on the Edge runtime, where node:crypto's timingSafeEqual is
// unavailable. Hashing both sides with a per-request key makes the comparison
// constant-time regardless of input length.
async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  const key = await crypto.subtle.generateKey(
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const encoder = new TextEncoder();
  const [digestA, digestB] = await Promise.all([
    crypto.subtle.sign('HMAC', key, encoder.encode(a)),
    crypto.subtle.sign('HMAC', key, encoder.encode(b)),
  ]);

  const bytesA = new Uint8Array(digestA);
  const bytesB = new Uint8Array(digestB);
  let diff = 0;

  for (let i = 0; i < bytesA.length; i += 1) {
    diff |= bytesA[i] ^ bytesB[i];
  }

  return diff === 0;
}

function extractToken(request: NextRequest): string | null {
  const header = request.headers.get('authorization');

  if (!header || !header.startsWith(BEARER_PREFIX)) {
    return null;
  }

  return header.slice(BEARER_PREFIX.length).trim() || null;
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const expected = process.env.PROSPECTS_API_KEY;

  // Fail closed: an unconfigured key must never leave prospect data open.
  if (!expected) {
    return NextResponse.json(
      { error: 'Service unavailable' },
      { status: 503 }
    );
  }

  const token = extractToken(request);

  if (!token || !(await timingSafeEqual(token, expected))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/prospects/:path*',
    '/api/prospects',
    '/api/weekly/:path*',
    '/api/weekly',
    '/api/surveys/:path*',
    '/api/surveys',
  ],
};
