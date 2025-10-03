export interface Photo {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  imageAlt: string;
  location?: string;
  dateTaken?: Date;
  tags: string[];
  featured: boolean;
  metadata: {
    width: number;
    height: number;
    format: string;
  };
}

export interface PhotoCollection {
  id: string;
  name: string;
  description?: string;
  photos: Photo[];
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  tags?: string[];
  featured?: boolean;
  search?: string;
}

// Site content types
export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  socialMedia: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
  googleAnalyticsId?: string;
  favicon?: string;
  logo?: string;
}

export interface HomePage {
  heroSection: {
    title: string;
    subtitle: string;
    description?: string;
    backgroundImageUrl?: string;
    buttons?: {
      text: string;
      link: string;
      style: 'primary' | 'secondary';
      icon?: 'eye' | 'camera' | 'arrow-right' | 'none';
    }[];
  };
  featuredSection: {
    title: string;
    description: string;
    showFeaturedPhotos: boolean;
  };
  aboutSection: {
    title: string;
    description: string;
    imageUrl?: string;
    ctaText?: string;
    ctaLink?: string;
  };
  statsCard?: {
    title: string;
    subtitle: string;
    statistics: {
      number: string;
      label: string;
    }[];
  };
}

export interface ExplorePage {
  title: string;
  description: string;
  loadingText: string;
  emptyStateTitle: string;
  emptyStateDescription: string;
  searchPlaceholder: string;
  filtersButtonText: string;
  activeFiltersText: string;
  clearAllFiltersText: string;
  filterLabels: {
    photoType: string;
    allPhotos: string;
    featuredOnly: string;
    regularOnly: string;
    tags: string;
  };
}

export interface NavigationItem {
  name: string;
  href: string;
  order: number;
}

export interface Navigation {
  brandName: string;
  menuItems: NavigationItem[];
  mobileMenuToggleLabel: string;
}

export interface QuickLink {
  name: string;
  href: string;
  order: number;
}

export interface AdditionalSection {
  title: string;
  links: {
    name: string;
    href: string;
  }[];
}

export interface Footer {
  brandName: string;
  brandDescription: string;
  contactSectionTitle: string;
  email: string;
  location: string;
  phone?: string;
  quickLinksSectionTitle: string;
  quickLinks: QuickLink[];
  additionalSections: AdditionalSection[];
  copyrightText: string;
  tagline: string;
}