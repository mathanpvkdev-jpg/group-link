import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '@/core/contracts/api.contract';

export const dynamic = 'force-dynamic';

function sanitizeText(val: unknown, maxLen: number): string {
  return String(val || '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLen);
}

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();

  try {
    const body = await request.json();
    const businessId = sanitizeText(body.businessId, 80);
    const customerPhone = sanitizeText(body.customerPhone, 30);
    const requirement = sanitizeText(body.requirement, 1000);
    const customerName = sanitizeText(body.customerName || 'Anonymous Customer', 100);
    const pincode = body.pincode ? sanitizeText(body.pincode, 12) : null;

    if (!businessId || customerPhone.length < 6 || requirement.length < 3) {
      return NextResponse.json(
        createErrorResponse(
          'VALIDATION_ERROR',
          'Missing or invalid required fields: businessId, customerPhone, and requirement are required.',
          requestId
        ),
        { status: 400 }
      );
    }

    const lead = {
      id: `lead-${Date.now()}`,
      businessId,
      customerName,
      customerPhone,
      requirement,
      pincode,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      createSuccessResponse(lead, { requestId }),
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      createErrorResponse('INVALID_BODY', 'Failed to parse JSON request body', requestId),
      { status: 400 }
    );
  }
}
