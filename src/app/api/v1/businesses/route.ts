import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '@/core/contracts/api.contract';
import { SEED_BUSINESSES } from '@/lib/local-biz/seed-data';

export const dynamic = 'force-dynamic';

function sanitizeText(val: unknown, maxLen: number): string {
  return String(val || '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLen);
}

export async function GET(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();
  const searchParams = request.nextUrl.searchParams;

  const state = searchParams.get('state');
  const district = searchParams.get('district');
  const category = searchParams.get('category');
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20', 10) || 20, 1), 50);

  let list = [...SEED_BUSINESSES];
  if (state) {
    list = list.filter((b) => (b.state || '').toLowerCase() === state.toLowerCase());
  }
  if (district) {
    const distLower = district.toLowerCase();
    list = list.filter((b) => {
      const cityName = typeof b.city === 'object' && b.city ? b.city.name : (typeof b.city === 'string' ? b.city : '');
      const addr = b.address || '';
      return cityName.toLowerCase() === distLower || addr.toLowerCase().includes(distLower);
    });
  }
  if (category) {
    const catLower = category.toLowerCase();
    list = list.filter((b) => {
      const catId = (b as any).category_id || (b as any).categoryId || '';
      return catId.toLowerCase() === catLower;
    });
  }

  const paginated = list.slice(0, limit);

  return NextResponse.json(
    createSuccessResponse(paginated, {
      requestId,
      totalCount: list.length,
      limit,
      nextCursor: list.length > limit ? 'biz-next-cursor' : null,
    })
  );
}

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();

  try {
    const body = await request.json();
    const cleanName = sanitizeText(body.name, 200);
    const cleanPhone = sanitizeText(body.phone, 40);
    const cleanState = sanitizeText(body.state, 100);
    const cleanCity = sanitizeText(body.city, 100);
    const cleanAddress = sanitizeText(body.address || `${cleanCity}, ${cleanState}`, 300);
    const cleanCategoryId = sanitizeText(body.categoryId || 'home-services', 80);

    if (!cleanName || cleanName.length < 2 || !cleanPhone || cleanPhone.length < 6 || !cleanState || !cleanCity) {
      return NextResponse.json(
        createErrorResponse(
          'VALIDATION_ERROR',
          'Missing or invalid required fields: name, phone, state, and city are mandatory.',
          requestId
        ),
        { status: 400 }
      );
    }

    const newBusiness = {
      id: `biz-${Date.now()}`,
      name: cleanName,
      slug: cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      phone: cleanPhone,
      state: cleanState,
      city: cleanCity,
      address: cleanAddress,
      categoryId: cleanCategoryId,
      status: 'approved',
      isVerified: true,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      createSuccessResponse(newBusiness, { requestId }),
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      createErrorResponse('INVALID_BODY', 'Failed to parse JSON request body', requestId),
      { status: 400 }
    );
  }
}
