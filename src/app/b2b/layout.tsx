import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://grouphub-eta.vercel.app';

export const metadata: Metadata = {
  title: 'Nammabus B2B Wholesale – Direct Factory Suppliers & Industrial Machinery India',
  description: 'Connect directly with 50,000+ verified Indian manufacturers. Source industrial machinery, corrugated packaging, solar panels, and textile raw materials at factory wholesale rates.',
  keywords: [
    'B2B wholesale India',
    'factory direct suppliers',
    'industrial machinery manufacturers',
    'corrugated boxes wholesale',
    'rooftop solar panel suppliers',
    'textile yarn export Tiruppur',
    'Nammabus B2B marketplace',
  ],
  openGraph: {
    title: 'Nammabus B2B Wholesale – Factory Direct Suppliers India',
    description: 'Source industrial equipment, bulk wholesale supplies, and raw materials at verified manufacturer rates.',
    url: `${siteUrl}/b2b`,
    type: 'website',
  },
  alternates: {
    canonical: `${siteUrl}/b2b`,
  },
};

export default function B2BLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
