import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://joelphotography.com';
const siteName = 'Joel Photography';
const defaultTitle = 'Joel Photography - Professional Wildlife Photography';
const defaultDescription = 'Professional wildlife photographer capturing the beauty and majesty of animals in their natural habitats. Explore stunning wildlife photography from around the world.';

export function generateMetadata({
  title,
  description,
  path = '',
  images,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  images?: string[];
  noIndex?: boolean;
} = {}): Metadata {
  const fullTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const fullDescription = description || defaultDescription;
  const url = `${siteUrl}${path}`;

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: [
      'wildlife photography',
      'nature photography',
      'professional photographer',
      'wildlife',
      'animals',
      'nature',
      'conservation',
      'outdoor photography',
      'Joel',
    ],
    authors: [{ name: 'Joel', url: siteUrl }],
    creator: 'Joel',
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: url,
      siteName: siteName,
      images: images || [`${siteUrl}/og-image.jpg`],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: images || [`${siteUrl}/og-image.jpg`],
      creator: '@joelphotography',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      nocache: false,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_VERIFICATION,
    },
  };
}

export function generatePhotoMetadata(photo: {
  title: string;
  description?: string;
  imageUrl: string;
  location?: string;
  tags: string[];
}) {
  const title = `${photo.title} - Wildlife Photography`;
  const description = photo.description || `${photo.title} captured in ${photo.location || 'the wild'}. Professional wildlife photography by Joel.`;

  return generateMetadata({
    title,
    description,
    images: [photo.imageUrl],
  });
}

export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Joel',
  jobTitle: 'Professional Wildlife Photographer',
  description: defaultDescription,
  url: siteUrl,
  sameAs: [
    // Add social media URLs here
  ],
  knowsAbout: [
    'Wildlife Photography',
    'Nature Photography',
    'Animal Photography',
    'Conservation Photography',
    'Outdoor Photography',
  ],
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Wildlife Photographer',
    occupationLocation: {
      '@type': 'Place',
      name: 'Colorado, USA',
    },
  },
};