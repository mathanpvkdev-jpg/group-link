import type { Metadata } from 'next';
import { SEED_BUSINESSES } from '@/lib/local-biz/seed-data';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://grouphub-eta.vercel.app';

interface BusinessLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const business = SEED_BUSINESSES.find((b) => b.slug === slug);

  if (!business) {
    return {
      title: 'Business Profile | Nammabus Local Directory',
      description: 'Explore verified local business details, contact information, customer reviews, and services on Nammabus.',
    };
  }

  const title = `${business.name} – ${business.area}, ${business.city_name} | Verified Business`;
  const description = `${business.name} in ${business.area}, ${business.city_name}, ${business.state}. ${business.short_description || business.description.slice(0, 140)}... Contact on WhatsApp or phone.`;

  return {
    title,
    description,
    keywords: [
      business.name,
      `${business.name} ${business.city_name}`,
      `${business.category_name} in ${business.area}`,
      `${business.area} ${business.city_name}`,
      `${business.business_type} ${business.city_name}`,
      'verified local business',
    ],
    openGraph: {
      title,
      description,
      url: `${siteUrl}/local-biz/businesses/${slug}`,
      type: 'profile',
      images: [
        {
          url: business.cover_image_url || `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${business.name} - ${business.city_name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [business.cover_image_url || `${siteUrl}/og-image.png`],
    },
    alternates: {
      canonical: `${siteUrl}/local-biz/businesses/${slug}`,
    },
  };
}

export default async function BusinessLayout({
  children,
  params,
}: BusinessLayoutProps) {
  const { slug } = await params;
  const business = SEED_BUSINESSES.find((b) => b.slug === slug);

  const localBusinessSchema = business
    ? {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: business.name,
        description: business.description,
        telephone: business.phone || business.whatsapp,
        url: `${siteUrl}/local-biz/businesses/${slug}`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: business.address,
          addressLocality: business.area,
          addressRegion: business.state,
          postalCode: business.pincode,
          addressCountry: 'IN',
        },
        geo:
          business.latitude && business.longitude
            ? {
                '@type': 'GeoCoordinates',
                latitude: business.latitude,
                longitude: business.longitude,
              }
            : undefined,
        aggregateRating:
          business.rating && business.reviews_count
            ? {
                '@type': 'AggregateRating',
                ratingValue: business.rating,
                reviewCount: business.reviews_count,
              }
            : undefined,
        priceRange: '₹₹',
      }
    : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Businesses', item: `${siteUrl}/local-biz/businesses` },
      ...(business?.city_name
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: business.city_name,
              item: `${siteUrl}/local-biz/businesses?city=${encodeURIComponent(business.city_name.toLowerCase())}`,
            },
          ]
        : []),
      {
        '@type': 'ListItem',
        position: business?.city_name ? 4 : 3,
        name: business?.name || slug,
        item: `${siteUrl}/local-biz/businesses/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {localBusinessSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      )}
      {children}
    </>
  );
}
