import type { Metadata } from 'next';
import { PLAYZONE_GAMES } from '@/lib/games/catalog';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://group-link.vercel.app';

export const metadata: Metadata = {
  title: 'PlayZone – 30+ Free Instant HTML5 Games & Brain Teasers | No Install',
  description: 'Play 30+ free instant brain games including 2048, Mental Math Sprint, Count Numbers, Count Cat & Schulte Grid. Fast, free, mobile-friendly with zero ads and local high scores.',
  keywords: [
    'free online games',
    'instant games no install',
    '2048 game online free',
    'mental math sprint',
    'brain training games',
    'play free html5 games',
    'schulte grid speed training',
    'kids counting games',
    'mobile browser games',
  ],
  openGraph: {
    title: 'PlayZone – 30+ Free Instant HTML5 Games & Brain Teasers',
    description: 'Play 2048, Mental Math Sprint, Count Cat & Schulte Grid online. Free, instant play with zero downloads.',
    url: `${siteUrl}/games`,
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'PlayZone Free Instant HTML5 Games',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PlayZone – 30+ Free Instant Games',
    description: 'Challenge your brain with 2048, Mental Math Sprint, and Schulte Grid. Free, instant play on mobile and desktop.',
    images: [`${siteUrl}/og-image.png`],
  },
  alternates: {
    canonical: `${siteUrl}/games`,
  },
};

const gamesSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'PlayZone Instant HTML5 Brain Games',
  description: 'Collection of 30+ lightweight, instant-play browser games with zero downloads or registration required.',
  itemListElement: PLAYZONE_GAMES.slice(0, 10).map((game, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'SoftwareApplication',
      name: game.title,
      description: game.description,
      operatingSystem: 'Any Web Browser (Mobile, Tablet, Desktop)',
      applicationCategory: 'GameApplication',
      genre: game.categoryTitle,
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'INR',
      },
    },
  })),
};

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gamesSchema) }}
      />
      {children}
    </>
  );
}
