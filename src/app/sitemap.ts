import { MetadataRoute } from 'next';
import { SAFE_COUNTRIES, CATEGORIES, INITIAL_GROUPS, BLOG_POSTS } from '@/lib/data';
import { SEED_BUSINESSES } from '@/lib/local-biz/seed-data';
import { SUPPORTED_LANGUAGES } from '@/lib/seo-engine';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://group-link.vercel.app';
  const currentDate = new Date('2026-11-25');

  // 1. Core Clean Canonical Pages (No thin query filters)
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

  // 2. Country GEO Hubs
  const countryRoutes = SAFE_COUNTRIES.map((c) => ({
    url: `${baseUrl}/groups/${c.slug}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // 3. Programmatic India Language & Category Landing Pages (Only include pages with actual matching groups to avoid thin doorway indexing)
  const programmaticRoutes: MetadataRoute.Sitemap = [];
  for (const lang of SUPPORTED_LANGUAGES) {
    const langHasGroups = INITIAL_GROUPS.some(
      (g) =>
        g.country.toLowerCase() === 'india' &&
        ((g.language || '').toLowerCase() === lang.name.toLowerCase() ||
          `${g.name} ${g.description}`.toLowerCase().includes(lang.name.toLowerCase()))
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
      const catHasGroups = INITIAL_GROUPS.some(
        (g) =>
          g.country.toLowerCase() === 'india' &&
          ((g.language || '').toLowerCase() === lang.name.toLowerCase() ||
            `${g.name} ${g.description}`.toLowerCase().includes(lang.name.toLowerCase())) &&
          ((g.category || '').toLowerCase().includes(cat.name.toLowerCase()) ||
            (cat.slug === 'jobs' && (g.category || '').toLowerCase().includes('job')))
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

  // 4. Individual Verified Group Detail Pages
  const groupRoutes = INITIAL_GROUPS.map((g) => ({
    url: `${baseUrl}/group/${g.slug}`,
    lastModified: new Date(g.updatedAt || '2026-11-22'),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 5. Verified Local Business Detail Pages
  const businessRoutes = SEED_BUSINESSES.map((b) => ({
    url: `${baseUrl}/local-biz/businesses/${b.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 6. Editorial SEO Blog Articles
  const blogRoutes = BLOG_POSTS.map((b) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
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
