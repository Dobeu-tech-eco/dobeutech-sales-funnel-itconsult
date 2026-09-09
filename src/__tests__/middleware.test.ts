/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';

const API_KEY = 'test-key-9f2b7c41a8e34d5f9b0c1e6a7d8f3b25';

function requestWithAuth(authorization?: string): NextRequest {
  return new NextRequest('https://example.com/api/prospects', {
    headers: authorization ? { authorization } : {},
  });
}

describe('API auth middleware', () => {
  const originalKey = process.env.PROSPECTS_API_KEY;

  afterEach(() => {
    process.env.PROSPECTS_API_KEY = originalKey;
  });

  test('rejects requests with no Authorization header', async () => {
    process.env.PROSPECTS_API_KEY = API_KEY;

    const response = await middleware(requestWithAuth());

    expect(response.status).toBe(401);
  });

  test('rejects requests with an incorrect key', async () => {
    process.env.PROSPECTS_API_KEY = API_KEY;

    const response = await middleware(requestWithAuth('Bearer wrong-key'));

    expect(response.status).toBe(401);
  });

  test('rejects a non-Bearer scheme carrying the correct key', async () => {
    process.env.PROSPECTS_API_KEY = API_KEY;

    const response = await middleware(requestWithAuth(`Basic ${API_KEY}`));

    expect(response.status).toBe(401);
  });

  test('fails closed when no key is configured', async () => {
    delete process.env.PROSPECTS_API_KEY;

    const response = await middleware(requestWithAuth(`Bearer ${API_KEY}`));

    expect(response.status).toBe(503);
  });

  test('allows requests carrying the correct key', async () => {
    process.env.PROSPECTS_API_KEY = API_KEY;

    const response = await middleware(requestWithAuth(`Bearer ${API_KEY}`));

    expect(response.status).toBe(200);
    expect(response.headers.get('x-middleware-next')).toBe('1');
  });
});
