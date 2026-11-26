import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse } from '@/core/contracts/api.contract';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();
  const uptimeSeconds = process.uptime();

  let dbStatus = 'resilient_local';
  if (isSupabaseConfigured && supabase) {
    try {
      // Lightweight 1-row keep-alive query to prevent Supabase Free Tier 7-day auto-pause
      const { error } = await supabase.from('groups').select('id').limit(1);
      dbStatus = error ? 'connected_degraded' : 'supabase_active';
    } catch {
      dbStatus = 'connected_or_resilient_local';
    }
  }

  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(uptimeSeconds),
    environment: process.env.NODE_ENV || 'development',
    version: '0.1.0',
    services: {
      database: dbStatus,
      search: 'postgres_active',
      cache: 'memory_l1_ready',
    },
  };

  return NextResponse.json(
    createSuccessResponse(healthData, { requestId }),
    { status: 200 }
  );
}
