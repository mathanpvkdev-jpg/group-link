import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { ADSENSE_CLIENT_ID } from '@/lib/ad-config';
import { AdSenseAccessWallModal } from '@/components/AdSenseAccessWallModal';
import { LegalSafetyDisclaimerModal } from '@/components/LegalSafetyDisclaimerModal';
import { RightPageScrollLine } from '@/components/common/RightPageScrollLine';

const inter = Inter({ subsets: ['latin'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://grouphub-eta.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Nammabus & GroupHub – Verified Business Directory & Active Group Links',
    template: '%s | Nammabus & GroupHub',
  },
  description: "India's verified business discovery & community directory. Find verified local merchants, home technicians, wedding photographers, caterers, tailors, B2B wholesale suppliers, and active community links on WhatsApp, Telegram & Instagram.",
  keywords: [
    'WhatsApp group links India',
    'Chennai job WhatsApp groups',
    'Tamil Nadu WhatsApp group links',
    'Telegram channels India',
    'Search WhatsApp groups',
    'Nammabus business directory',
    'verified merchants India',
    'hire local technicians',
    'B2B wholesale suppliers India',
    'PlayZone free instant games',
  ],
  authors: [{ name: 'Nammabus & GroupHub Team' }],
  creator: 'Nammabus India',
  publisher: 'Nammabus & GroupHub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'Nammabus & GroupHub',
    title: 'Nammabus & GroupHub – Verified Business Directory & Searchable Group Links',
    description: "Discover 50,000+ active WhatsApp & Telegram communities, verified local merchants, and instant PlayZone games across India.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Nammabus & GroupHub – India Business Directory & Community Links',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nammabus & GroupHub – Verified Business Directory & Active Groups',
    description: "Discover verified merchants, home services, active WhatsApp/Telegram groups, and free instant games across India.",
    images: [`${siteUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Nammabus & GroupHub India',
  url: siteUrl,
  logo: `${siteUrl}/icon.png`,
  description: "India's verified local business discovery, B2B wholesale marketplace, and searchable social community directory.",
  foundingDate: '2024',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
  },
  sameAs: [
    'https://twitter.com',
    'https://facebook.com',
    'https://instagram.com',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Nammabus & GroupHub',
  url: siteUrl,
  potentialAction: [
    {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/groups?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/local-biz/businesses?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        {/* Google Fonts: Plus Jakarta Sans, Inter & Material Symbols */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />

        {/* JSON-LD Structured Data: Organization & WebSite Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        {/* Inline Theme Init to prevent flash & ensure immediate sync */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('grouphub_theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
        {/* Next.js Optimized Google AdSense Script Injection */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} min-h-full antialiased transition-colors duration-200 pb-16 md:pb-0`}>
        {/* First-Visit Legal Disclaimer, User Safety & Fraud Awareness Modal */}
        <LegalSafetyDisclaimerModal />
        {/* 6-Hour Google AdSense Access Gate Modal */}
        <AdSenseAccessWallModal />
        {/* Right Page Loaded Scroll Line & Draggable Progress */}
        <RightPageScrollLine />
        {children}
      </body>
    </html>
  );
}
