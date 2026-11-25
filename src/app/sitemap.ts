import { MetadataRoute } from 'next';
import { SAFE_COUNTRIES, INITIAL_GROUPS, BLOG_POSTS } from '@/lib/data';
import { SEED_BUSINESSES, SEED_CATEGORIES, SEED_CITIES, SEED_PROFESSIONALS } from '@/lib/local-biz/seed-data';
import { PLAYZONE_GAMES } from '@/lib/games/catalog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://group-link.vercel.app';
  const currentDate = new Date('2026-11-25');

  // Core Static Hub Routes
  const staticRoutes = [
    '',
    '/whatsapp',
    '/telegram',
    '/groups',
    '/groups-2026',
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
    priority: route === '' ? 1.0 : route === '/games' || route === '/local-biz' || route === '/b2b' ? 0.9 : 0.8,
  }));

  // Country GEO routes
  const countryRoutes = SAFE_COUNTRIES.map((c) => ({
    url: `${baseUrl}/groups/${c.slug}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // Group detail routes
  const groupRoutes = INITIAL_GROUPS.map((g) => ({
    url: `${baseUrl}/group/${g.slug}`,
    lastModified: new Date(g.updatedAt || '2026-11-22'),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Blog post routes
  const blogRoutes = BLOG_POSTS.map((b) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Local Business detail routes
  const businessRoutes = SEED_BUSINESSES.map((b) => ({
    url: `${baseUrl}/local-biz/businesses/${b.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // City directory landing routes
  const cityRoutes = SEED_CITIES.map((c) => ({
    url: `${baseUrl}/local-biz/businesses?city=${encodeURIComponent(c.slug)}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Category directory landing routes
  const categoryRoutes = SEED_CATEGORIES.map((cat) => ({
    url: `${baseUrl}/local-biz/businesses?category=${encodeURIComponent(cat.slug)}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // PlayZone game direct routes
  const gameRoutes = PLAYZONE_GAMES.map((game) => ({
    url: `${baseUrl}/games?game=${encodeURIComponent(game.slug)}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...countryRoutes,
    ...groupRoutes,
    ...blogRoutes,
    ...businessRoutes,
    ...cityRoutes,
    ...categoryRoutes,
    ...gameRoutes,
  ];
}
