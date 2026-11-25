import type { Metadata } from 'next';
import { SEED_CATEGORIES } from '@/lib/local-biz/seed-data';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://group-link.vercel.app';

export const metadata: Metadata = {
  title: 'Nammabus – India\'s Trusted Local Business & Service Directory',
  description: 'Discover verified local businesses, home technicians, wedding photographers, caterers, tailors, and B2B manufacturers across 300+ Indian cities with zero broker commissions.',
  keywords: [
    'local business directory India',
    'verified merchants Chennai',
    'Tamil Nadu local services',
    'hire electrician plumber near me',
    'wedding photographer caterer Chennai',
    'B2B manufacturers directory India',
    'Nammabus local search',
  ],
  openGraph: {
    title: 'Nammabus – India\'s Trusted Business & Service Directory',
    description: 'Find verified local merchants, service specialists, and factory suppliers across India. Direct WhatsApp customer leads & zero brokerage.',
    url: `${siteUrl}/local-biz`,
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Nammabus Local Business Directory India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nammabus – Local Business Directory',
    description: 'Direct customer calls, verified seller badges, and zero broker fees across 300+ cities in India.',
    images: [`${siteUrl}/og-image.png`],
  },
  alternates: {
    canonical: `${siteUrl}/local-biz`,
  },
};

const localBizDirectorySchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Nammabus India Local Business & Services Catalog',
  description: 'Verified directory of local businesses, technicians, B2B suppliers, and service providers across India.',
  itemListElement: SEED_CATEGORIES.map((cat, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Service',
      name: cat.name,
      description: `Verified ${cat.name} businesses, shops, and service providers across India.`,
      url: `${siteUrl}/local-biz/businesses?category=${encodeURIComponent(cat.slug)}`,
    },
  })),
};

export default function LocalBizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBizDirectorySchema) }}
      />
      {children}
    </>
  );
}
