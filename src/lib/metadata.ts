import { Metadata } from 'next';
import { cmsClient } from './cms/client';
import { SiteSettings } from './cms/types';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://joelphotography.com';
const siteName = 'Joel Photography';
const defaultTitle = 'Joel Photography - Professional Wildlife Photography';
const defaultDescription = 'Professional wildlife photographer capturing the beauty and majesty of animals in their natural habitats. Explore stunning wildlife photography from around the world.';

export async function generateMetadataFromCMS({
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
} = {}): Promise<Metadata> {
  let siteSettings: SiteSettings;

  try {
    siteSettings = await cmsClient.getSiteSettings();
  } catch (error) {
    console.error('Error fetching site settings for metadata:', error);
    // Fallback to default values
    return generateMetadata({ title, description, path, images, noIndex });
  }

  const fullTitle = title ? `${title} | ${siteSettings.siteName}` : siteSettings.defaultMetaTitle;
  const fullDescription = description || siteSettings.defaultMetaDescription;
  const url = `${siteSettings.siteUrl || siteUrl}${path}`;

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
      siteSettings.siteName,
    ],
    authors: [{ name: siteSettings.siteName, url: siteSettings.siteUrl || siteUrl }],
    creator: siteSettings.siteName,
    publisher: siteSettings.siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteSettings.siteUrl || siteUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: url,
      siteName: siteSettings.siteName,
      images: images || [`${siteSettings.siteUrl || siteUrl}/og-image.jpg`],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: images || [`${siteSettings.siteUrl || siteUrl}/og-image.jpg`],
      creator: siteSettings.socialMedia?.twitter || '@joelphotography',
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
      google: siteSettings.googleAnalyticsId || process.env.GOOGLE_VERIFICATION,
    },
  };
}

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

export async function generateStructuredData(): Promise<object> {
  let siteSettings: SiteSettings;

  try {
    siteSettings = await cmsClient.getSiteSettings();
  } catch (error) {
    console.error('Error fetching site settings for structured data:', error);
    // Fallback to default structured data
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Joel',
      jobTitle: 'Professional Wildlife Photographer',
      description: defaultDescription,
      url: siteUrl,
      sameAs: [],
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
  }

  const sameAsLinks = [];
  if (siteSettings.socialMedia?.instagram) sameAsLinks.push(`https://instagram.com/${siteSettings.socialMedia.instagram.replace('@', '')}`);
  if (siteSettings.socialMedia?.facebook) sameAsLinks.push(`https://facebook.com/${siteSettings.socialMedia.facebook}`);
  if (siteSettings.socialMedia?.twitter) sameAsLinks.push(`https://twitter.com/${siteSettings.socialMedia.twitter.replace('@', '')}`);
  if (siteSettings.socialMedia?.youtube) sameAsLinks.push(`https://youtube.com/${siteSettings.socialMedia.youtube}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteSettings.siteName,
    jobTitle: 'Professional Wildlife Photographer',
    description: siteSettings.siteDescription,
    url: siteSettings.siteUrl || siteUrl,
    sameAs: sameAsLinks,
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
    },
  };
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