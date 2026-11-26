import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://grouphub-eta.vercel.app';

export const metadata: Metadata = {
  title: 'Free Directory Listing & Founding Member Packages | Nammabus India',
  description: '100% Free Forever ₹0 business listing for Indian shops, manufacturers, and technicians. Zero broker commissions and direct WhatsApp leads.',
  keywords: [
    'free business listing India',
    'zero broker fee directory',
    'claim business listing free',
    'Nammabus pricing',
    'free WhatsApp business promotion',
  ],
  openGraph: {
    title: 'Free Business Listing & Member Packages – Nammabus India',
    description: 'Claim your verified business listing across India for ₹0. Zero commission on customer leads.',
    url: `${siteUrl}/pricing`,
    type: 'website',
  },
  alternates: {
    canonical: `${siteUrl}/pricing`,
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
