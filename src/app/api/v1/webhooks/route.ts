import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createSuccessResponse, createErrorResponse } from '@/core/contracts/api.contract';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();
  const signature = request.headers.get('x-webhook-signature');
  const secret = process.env.WEBHOOK_SIGNING_SECRET;

  // Fail closed when webhook requests lack valid signature
  if (!secret) {
    return NextResponse.json(
      createErrorResponse('WEBHOOK_NOT_CONFIGURED', 'Webhook verification secret is not configured.', requestId),
      { status: 503 }
    );
  }
  if (!signature) {
    return NextResponse.json(
      createErrorResponse('UNAUTHORIZED_WEBHOOK', 'Missing x-webhook-signature header.', requestId),
      { status: 401 }
    );
  }

  try {
    const rawBody = await request.text();
    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    const bufA = Buffer.from(expected, 'hex');
    const bufB = Buffer.from(signature, 'hex');
    if (bufA.length === 0 || bufA.length !== bufB.length || !crypto.timingSafeEqual(bufA, bufB)) {
      return NextResponse.json(
        createErrorResponse('INVALID_SIGNATURE', 'Webhook signature mismatch.', requestId),
        { status: 403 }
      );
    }

    const body = JSON.parse(rawBody);
    const eventType = String(body.type || 'payment.succeeded').slice(0, 80);
    const eventId = String(body.id || `evt_${Date.now()}`).slice(0, 80);

    return NextResponse.json(
      createSuccessResponse(
        {
          received: true,
          eventId,
          eventType,
          processedAt: new Date().toISOString(),
          idempotent: true,
        },
        { requestId }
      ),
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      createErrorResponse('WEBHOOK_FAILED', 'Invalid webhook payload', requestId),
      { status: 400 }
    );
  }
}
