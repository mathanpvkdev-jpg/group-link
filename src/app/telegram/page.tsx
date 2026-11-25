import React from 'react';
import { Metadata } from 'next';
import DynamicGeoGroupPage from '../groups/[country]/[[...params]]/page';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://group-link.vercel.app';

export const metadata: Metadata = {
  title: 'Telegram Channels & Group Links Directory – Verified Invites',
  description: 'Discover active Telegram group links and broadcast channels in India for UPSC study notes, coding, business networking, and startup deals.',
  keywords: ['Telegram channels India', 'Telegram group links', 'Study Telegram channels', 'Tech Telegram groups India'],
  alternates: {
    canonical: `${siteUrl}/telegram`,
  },
  openGraph: {
    title: 'Telegram Channels & Group Links Directory – Verified Invites',
    description: 'Explore active Telegram channels and community groups across India.',
    url: `${siteUrl}/telegram`,
    type: 'website',
  },
};

export default function TelegramPage() {
  return <DynamicGeoGroupPage params={Promise.resolve({ country: 'india', params: ['business'] })} />;
}
