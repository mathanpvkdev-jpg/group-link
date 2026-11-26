import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://grouphub-eta.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/local-biz/admin',
          '/local-biz/admin/*',
          '/api/*',
          '/moderation',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/local-biz/admin',
          '/local-biz/admin/*',
          '/api/*',
          '/moderation',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
