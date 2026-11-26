import { NextResponse } from 'next/server';
import crypto from 'crypto';

function timingSafeHexEquals(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'hex');
    const bufB = Buffer.from(b, 'hex');
    if (bufA.length === 0 || bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Fail closed if webhook secret or signature header is missing
    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook verification secret not configured.' }, { status: 503 });
    }
    if (!signature) {
      return NextResponse.json({ error: 'Missing x-razorpay-signature header.' }, { status: 401 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (!timingSafeHexEquals(expectedSignature, signature)) {
      return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 403 });
    }

    const event = JSON.parse(rawBody);
    console.log(`[Razorpay Webhook] Verified event: ${event.event}`);

    return NextResponse.json({ received: true, status: 'processed' });
  } catch {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 });
  }
}
