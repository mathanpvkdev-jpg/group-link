import React from 'react';
import { Metadata } from 'next';
import DynamicGeoGroupPage from '../groups/[country]/[[...params]]/page';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://grouphub-eta.vercel.app';

export const metadata: Metadata = {
  title: 'WhatsApp Group Links Directory – Active & Verified Communities',
  description: 'Find active WhatsApp group links in India, Tamil Nadu, USA, and UAE for jobs, education, technology, and business. Zero spam, direct invite links.',
  keywords: ['WhatsApp group links', 'Tamil WhatsApp group links', 'Jobs WhatsApp group links', 'Education WhatsApp groups', 'Business WhatsApp groups'],
  alternates: {
    canonical: `${siteUrl}/whatsapp`,
  },
  openGraph: {
    title: 'WhatsApp Group Links Directory – Active & Verified Communities',
    description: 'Browse verified WhatsApp group invite links across jobs, study circles, tech, and business.',
    url: `${siteUrl}/whatsapp`,
    type: 'website',
  },
};

export default function WhatsAppPage() {
  return <DynamicGeoGroupPage params={Promise.resolve({ country: 'india', params: ['jobs'] })} />;
}
