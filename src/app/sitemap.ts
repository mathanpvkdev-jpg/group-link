import { MetadataRoute } from 'next';
import { SAFE_COUNTRIES, CATEGORIES, INITIAL_GROUPS, BLOG_POSTS } from '@/lib/data';
import { SEED_BUSINESSES } from '@/lib/local-biz/seed-data';
import { SUPPORTED_LANGUAGES } from '@/lib/seo-engine';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

// Edge-cache the dynamic sitemap for 1 hour to stay 100% free-tier safe while picking up new UGC records
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://grouphub-eta.vercel.app';
  const currentDate = new Date('2026-11-26');

  // 1. Fetch live user-generated groups & businesses from Supabase safely
  let liveGroupEntries: Array<{ slug: string; language?: string; category_name?: string; country?: string; updated_at?: string }> = [];
  let liveBizEntries: Array<{ slug: string; updated_at?: string }> = [];

  if (isSupabaseConfigured && supabase) {
    try {
      const [grpRes, bizRes] = await Promise.all([
        supabase
          .from('groups')
          .select('slug, language, category_name, country, updated_at')
          .eq('status', 'approved')
          .limit(500),
        supabase
          .from('businesses')
          .select('slug, updated_at')
          .eq('is_active', true)
          .limit(500),
      ]);
      if (!grpRes.error && grpRes.data) liveGroupEntries = grpRes.data;
      if (!bizRes.error && bizRes.data) liveBizEntries = bizRes.data;
    } catch {
      // Safe fallback to static seed records
    }
  }

  // Merge static & live groups deduplicated by slug
  const mergedGroupsMap = new Map<string, { slug: string; language: string; category: string; country: string; updatedAt: string }>();
  for (const g of INITIAL_GROUPS) {
    mergedGroupsMap.set(g.slug, {
      slug: g.slug,
      language: g.language || 'English',
      category: g.category || 'Technology',
      country: g.country || 'India',
      updatedAt: g.updatedAt || '2026-11-26',
    });
  }
  for (const lg of liveGroupEntries) {
    if (!mergedGroupsMap.has(lg.slug)) {
      mergedGroupsMap.set(lg.slug, {
        slug: lg.slug,
        language: lg.language || 'English',
        category: lg.category_name || 'Technology',
        country: lg.country || 'India',
        updatedAt: lg.updated_at || '2026-11-26',
      });
    }
  }
  const allGroups = Array.from(mergedGroupsMap.values());

  // Merge static & live businesses deduplicated by slug
  const mergedBizMap = new Map<string, { slug: string; updatedAt: string }>();
  for (const b of SEED_BUSINESSES) {
    mergedBizMap.set(b.slug, { slug: b.slug, updatedAt: b.updated_at || '2026-11-26' });
  }
  for (const lb of liveBizEntries) {
    if (!mergedBizMap.has(lb.slug)) {
      mergedBizMap.set(lb.slug, { slug: lb.slug, updatedAt: lb.updated_at || '2026-11-26' });
    }
  }

  // 2. Core Clean Canonical Pages (No thin query strings)
  const staticRoutes = [
    '',
    '/whatsapp',
    '/telegram',
    '/groups',
    '/groups-2026',
    '/india',
    '/games',
    '/local-biz',
    '/b2b',
    '/pricing',
    '/local-biz/add-business',
    '/local-biz/businesses',
    '/local-biz/categories',
    '/local-biz/cities',
    '/local-biz/professionals',
    '/local-biz/products',
    '/local-biz/services',
    '/submit-group',
    '/promote',
    '/blog',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/disclaimer',
    '/dmca',
    '/community-guidelines',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : route === '/india' || route === '/groups' || route === '/local-biz' || route === '/games' ? 0.9 : 0.8,
  }));

  // 3. Country GEO Hubs
  const countryRoutes = SAFE_COUNTRIES.map((c) => ({
    url: `${baseUrl}/groups/${c.slug}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // 4. Programmatic India Language & Category Landing Pages (Only include pages with actual matching groups)
  const programmaticRoutes: MetadataRoute.Sitemap = [];
  for (const lang of SUPPORTED_LANGUAGES) {
    const langHasGroups = allGroups.some(
      (g) =>
        g.country.toLowerCase() === 'india' &&
        g.language.toLowerCase().includes(lang.name.toLowerCase())
    );
    if (langHasGroups) {
      programmaticRoutes.push({
        url: `${baseUrl}/india/${lang.slug}`,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 0.85,
      });
    }

    for (const cat of CATEGORIES) {
      const catHasGroups = allGroups.some(
        (g) =>
          g.country.toLowerCase() === 'india' &&
          g.language.toLowerCase().includes(lang.name.toLowerCase()) &&
          (g.category.toLowerCase().includes(cat.name.toLowerCase()) ||
            (cat.slug === 'jobs' && g.category.toLowerCase().includes('job')) ||
            (cat.slug === 'education' && (g.category.toLowerCase().includes('education') || g.category.toLowerCase().includes('study'))))
      );
      if (catHasGroups) {
        programmaticRoutes.push({
          url: `${baseUrl}/india/${lang.slug}/${cat.slug}`,
          lastModified: currentDate,
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        });
      }
    }
  }

  // 5. Individual Verified Group Detail Pages (Static + Live UGC)
  const groupRoutes = allGroups.map((g) => ({
    url: `${baseUrl}/group/${g.slug}`,
    lastModified: new Date(g.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 6. Verified Local Business Detail Pages (Static + Live UGC)
  const businessRoutes = Array.from(mergedBizMap.values()).map((b) => ({
    url: `${baseUrl}/local-biz/businesses/${b.slug}`,
    lastModified: new Date(b.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 7. Editorial SEO Blog Articles (All 25 Articles)
  const blogRoutes = BLOG_POSTS.map((b) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  return [
    ...staticRoutes,
    ...countryRoutes,
    ...programmaticRoutes,
    ...groupRoutes,
    ...businessRoutes,
    ...blogRoutes,
  ];
}
