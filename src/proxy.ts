import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { edgeRateLimiter, writeRateLimiter } from '@/core/security/rate-limiter';
import { ADMIN_PORTAL_LOCKED } from '@/lib/forms-config';

/**
 * Next.js 16 Request Proxy (Edge Security & Access Control)
 */
export function proxy(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const ip =
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    '127.0.0.1';
  const pathname = request.nextUrl.pathname;

  // 1. Lock Admin & Moderation Portals (Auto-Admit Mode active until manual approval is enabled)
  if (
    ADMIN_PORTAL_LOCKED &&
    (pathname === '/admin' ||
      pathname.startsWith('/admin/') ||
      pathname === '/local-biz/admin' ||
      pathname.startsWith('/local-biz/admin/') ||
      pathname === '/moderation' ||
      pathname.startsWith('/moderation/'))
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. Apply tiered sliding-window rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    const isWriteMethod = request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'OPTIONS';
    const limiter = isWriteMethod ? writeRateLimiter : edgeRateLimiter;
    const rateCheck = limiter.check(`${ip}:${isWriteMethod ? 'w' : 'r'}`);

    if (!rateCheck.allowed) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests. Please slow down and try again later.',
            requestId,
          },
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil(rateCheck.resetMs / 1000).toString(),
            'x-request-id': requestId,
          },
        }
      );
    }
  }

  const response = NextResponse.next();

  // Attach distributed correlation ID
  response.headers.set('x-request-id', requestId);

  // Hardened HTTP Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  response.headers.set('X-DNS-Prefetch-Control', 'on');

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|logos|icons).*)',
  ],
};
