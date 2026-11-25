import React from 'react';
import { Metadata } from 'next';
import DynamicGeoGroupPage, {
  generateMetadata as generateGeoMetadata,
} from '@/app/groups/[country]/[[...params]]/page';

interface IndiaPageProps {
  params: Promise<{
    params?: string[];
  }>;
}

export async function generateMetadata({ params }: IndiaPageProps): Promise<Metadata> {
  const resolved = await params;
  return generateGeoMetadata({
    params: Promise.resolve({
      country: 'india',
      params: resolved.params,
    }),
  });
}

export default async function IndiaGeoGroupPage({ params }: IndiaPageProps) {
  const resolved = await params;
  return (
    <DynamicGeoGroupPage
      params={Promise.resolve({
        country: 'india',
        params: resolved.params,
      })}
    />
  );
}
