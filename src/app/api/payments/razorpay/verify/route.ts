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
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
      amount,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { verified: false, error: 'Missing required payment verification tokens.' },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      // Fail closed: never allow unverified payment confirmation without configured secret
      return NextResponse.json(
        { verified: false, error: 'Payment gateway verification is not configured on this server.' },
        { status: 503 }
      );
    }

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${String(razorpay_order_id)}|${String(razorpay_payment_id)}`)
      .digest('hex');

    if (!timingSafeHexEquals(generatedSignature, String(razorpay_signature))) {
      return NextResponse.json(
        { verified: false, error: 'Cryptographic signature mismatch. Payment verification failed.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      verified: true,
      orderId: String(razorpay_order_id),
      paymentId: String(razorpay_payment_id),
      planId: String(planId || 'basic'),
      amount: Number(amount) || 99,
      status: 'captured',
      verifiedAt: new Date().toISOString(),
      message: 'Payment signature verified successfully.',
    });
  } catch {
    return NextResponse.json(
      { verified: false, error: 'Payment signature verification failed.' },
      { status: 400 }
    );
  }
}
