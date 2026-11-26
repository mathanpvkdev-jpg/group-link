import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '@/core/contracts/api.contract';
import { INITIAL_GROUPS } from '@/lib/data';
import { validateGroupInviteUrl } from '@/lib/seo-engine';

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

  const platform = searchParams.get('platform');
  const category = searchParams.get('category');
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20', 10) || 20, 1), 50);

  let list = [...INITIAL_GROUPS];
  if (platform && platform !== 'all') {
    list = list.filter((g) => g.platform.toLowerCase() === platform.toLowerCase());
  }
  if (category && category !== 'all') {
    list = list.filter((g) => g.category.toLowerCase() === category.toLowerCase());
  }

  const paginated = list.slice(0, limit);

  return NextResponse.json(
    createSuccessResponse(paginated, {
      requestId,
      totalCount: list.length,
      limit,
      nextCursor: list.length > limit ? 'groups-next-cursor' : null,
    })
  );
}

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();

  try {
    const body = await request.json();
    const cleanName = sanitizeText(body.name, 160);
    const cleanPlatform = sanitizeText(body.platform, 30).toLowerCase();
    const cleanInviteUrl = String(body.inviteUrl || '').trim().slice(0, 500);
    const cleanCategory = sanitizeText(body.category || 'Technology', 80);

    if (!cleanName || cleanName.length < 3 || !cleanInviteUrl || !cleanPlatform) {
      return NextResponse.json(
        createErrorResponse(
          'VALIDATION_ERROR',
          'Missing or invalid required fields: name (min 3 chars), platform, and inviteUrl are mandatory.',
          requestId
        ),
        { status: 400 }
      );
    }

    const urlValidation = validateGroupInviteUrl(cleanInviteUrl);
    if (!urlValidation.valid) {
      return NextResponse.json(
        createErrorResponse(
          'INVALID_INVITE_URL',
          urlValidation.reason || 'Invite link failed platform URL validation.',
          requestId
        ),
        { status: 400 }
      );
    }

    // Auto-admit directly until manual admin approvals are enabled
    const newGroup = {
      id: `grp-${Date.now()}`,
      name: cleanName,
      slug: cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      platform: cleanPlatform,
      inviteUrl: cleanInviteUrl,
      category: cleanCategory,
      status: 'approved',
      memberCount: 1,
      isVerified: true,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      createSuccessResponse(newGroup, { requestId }),
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      createErrorResponse('INVALID_BODY', 'Failed to parse JSON request body', requestId),
      { status: 400 }
    );
  }
}
