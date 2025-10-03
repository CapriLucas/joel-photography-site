import { CMSAdapter } from '../interface';
import { Photo, PhotoCollection, QueryOptions, SiteSettings, HomePage, ExplorePage, Navigation, Footer } from '../types';

export class MockAdapter implements CMSAdapter {
  private mockPhotos: Photo[] = [
    {
      id: '1',
      title: 'Mountain Eagle',
      description: 'A majestic golden eagle soaring over the Rocky Mountains',
      imageUrl: 'https://images.unsplash.com/photo-1574168073942-be24900d4b3b?w=800&q=80',
      imageAlt: 'Golden eagle in flight with mountains in background',
      location: 'Rocky Mountains, Colorado',
      dateTaken: new Date('2024-08-15'),
      tags: ['eagle', 'mountains', 'wildlife', 'birds'],
      featured: true,
      metadata: {
        width: 800,
        height: 600,
        format: 'jpg',
      },
    },
    {
      id: '2',
      title: 'Forest Wolf',
      description: 'A gray wolf in its natural forest habitat during autumn',
      imageUrl: 'https://images.unsplash.com/photo-1582809088726-96cd3a3d4db5?w=800&q=80',
      imageAlt: 'Gray wolf standing in autumn forest',
      location: 'Yellowstone National Park',
      dateTaken: new Date('2024-09-20'),
      tags: ['wolf', 'forest', 'autumn', 'wildlife'],
      featured: true,
      metadata: {
        width: 800,
        height: 600,
        format: 'jpg',
      },
    },
    {
      id: '3',
      title: 'Arctic Fox',
      description: 'Beautiful arctic fox with winter coat in snow',
      imageUrl: 'https://images.unsplash.com/photo-1488455447093-4c86e4ea26b9?w=800&q=80',
      imageAlt: 'White arctic fox in snowy landscape',
      location: 'Alaska',
      dateTaken: new Date('2024-01-10'),
      tags: ['fox', 'arctic', 'snow', 'winter'],
      featured: false,
      metadata: {
        width: 800,
        height: 600,
        format: 'jpg',
      },
    },
    {
      id: '4',
      title: 'Ocean Whale',
      description: 'Humpback whale breaching in Pacific Ocean',
      imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
      imageAlt: 'Humpback whale jumping out of ocean water',
      location: 'Pacific Ocean',
      dateTaken: new Date('2024-07-05'),
      tags: ['whale', 'ocean', 'marine', 'wildlife'],
      featured: true,
      metadata: {
        width: 800,
        height: 600,
        format: 'jpg',
      },
    },
    {
      id: '5',
      title: 'Desert Coyote',
      description: 'Coyote in desert landscape at sunset',
      imageUrl: 'https://images.unsplash.com/photo-1633425651618-b5b4b5a5c8b5?w=800&q=80',
      imageAlt: 'Coyote silhouetted against desert sunset',
      location: 'Arizona Desert',
      dateTaken: new Date('2024-05-18'),
      tags: ['coyote', 'desert', 'sunset', 'wildlife'],
      featured: false,
      metadata: {
        width: 800,
        height: 600,
        format: 'jpg',
      },
    },
    {
      id: '6',
      title: 'Rainforest Jaguar',
      description: 'Jaguar resting on a tree branch in tropical rainforest',
      imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&q=80',
      imageAlt: 'Jaguar on tree branch in rainforest',
      location: 'Amazon Rainforest',
      dateTaken: new Date('2024-06-12'),
      tags: ['jaguar', 'rainforest', 'tree', 'wildlife'],
      featured: false,
      metadata: {
        width: 800,
        height: 600,
        format: 'jpg',
      },
    },
  ];

  async getPhotos(options: QueryOptions = {}): Promise<Photo[]> {
    let filteredPhotos = [...this.mockPhotos];

    if (options.featured !== undefined) {
      filteredPhotos = filteredPhotos.filter(photo => photo.featured === options.featured);
    }

    if (options.tags && options.tags.length > 0) {
      filteredPhotos = filteredPhotos.filter(photo =>
        options.tags!.some(tag => photo.tags.includes(tag))
      );
    }

    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filteredPhotos = filteredPhotos.filter(photo =>
        photo.title.toLowerCase().includes(searchLower) ||
        photo.description?.toLowerCase().includes(searchLower) ||
        photo.location?.toLowerCase().includes(searchLower) ||
        photo.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (options.offset) {
      filteredPhotos = filteredPhotos.slice(options.offset);
    }

    if (options.limit) {
      filteredPhotos = filteredPhotos.slice(0, options.limit);
    }

    return filteredPhotos;
  }

  async getFeaturedPhotos(): Promise<Photo[]> {
    return this.getPhotos({ featured: true });
  }

  async getPhotoById(id: string): Promise<Photo | null> {
    return this.mockPhotos.find(photo => photo.id === id) || null;
  }

  async getCollections(): Promise<PhotoCollection[]> {
    return [
      {
        id: 'featured',
        name: 'Featured Wildlife',
        description: 'Our most stunning wildlife photography captures',
        photos: await this.getFeaturedPhotos(),
      },
      {
        id: 'mammals',
        name: 'Mammals',
        description: 'Beautiful mammals from around the world',
        photos: this.mockPhotos.filter(photo =>
          photo.tags.some(tag => ['wolf', 'fox', 'coyote', 'jaguar'].includes(tag))
        ),
      },
    ];
  }

  async searchPhotos(query: string): Promise<Photo[]> {
    return this.getPhotos({ search: query });
  }

  async getSiteSettings(): Promise<SiteSettings> {
    return {
      siteName: "Joel Wildlife Photography",
      siteDescription: "Professional wildlife photography capturing nature's most beautiful moments",
      siteUrl: "https://joelphotography.com",
      defaultMetaTitle: "Joel Wildlife Photography - Professional Wildlife Photography",
      defaultMetaDescription: "Discover stunning wildlife photography from around the world. Professional wildlife photographer capturing nature's most beautiful moments.",
      socialMedia: {
        instagram: "@joelphotography",
        facebook: "joelphotography",
        twitter: "@joelphoto",
      },
      googleAnalyticsId: "GA-XXXXXXXXX",
    };
  }

  async getHomePage(): Promise<HomePage> {
    return {
      heroSection: {
        title: "Wild Moments Captured",
        subtitle: "Discover the beauty of wildlife through professional photography",
        description: "Capturing the beauty and majesty of wildlife in their natural habitats. Experience the raw emotion and incredible moments of nature through my lens.",
        buttons: [
          {
            text: "Explore Gallery",
            link: "/explore",
            style: "primary" as const,
            icon: "eye" as const,
          },
          {
            text: "Featured Work",
            link: "/explore",
            style: "secondary" as const,
            icon: "camera" as const,
          },
        ],
      },
      featuredSection: {
        title: "Featured Work",
        description: "A curated selection of my best wildlife photography from expeditions around the world",
        showFeaturedPhotos: true,
      },
      aboutSection: {
        title: "About the Artist",
        description: "I'm a passionate wildlife photographer dedicated to capturing nature's most beautiful and fleeting moments. With over 10 years of experience photographing wildlife across six continents, I strive to create images that tell the story of our planet's incredible biodiversity.",
        ctaText: "View Full Gallery",
        ctaLink: "/explore",
      },
      statsCard: {
        title: "Professional Wildlife Photographer",
        subtitle: "Capturing nature's finest moments",
        statistics: [
          { number: "10+", label: "Years Experience" },
          { number: "50+", label: "Species Captured" },
          { number: "15+", label: "Countries Visited" },
          { number: "1000+", label: "Photos Taken" },
        ],
      },
    };
  }

  async getExplorePage(): Promise<ExplorePage> {
    return {
      title: "Explore Wildlife Photography",
      description: "Browse through our extensive collection of stunning wildlife photographs from around the world",
      loadingText: "Loading amazing wildlife photos...",
      emptyStateTitle: "No photos found",
      emptyStateDescription: "Try adjusting your search criteria or filters to discover more wildlife photography.",
      searchPlaceholder: "Search by animal, location, or tag...",
      filtersButtonText: "Filters",
      activeFiltersText: "Active filters:",
      clearAllFiltersText: "Clear all filters",
      filterLabels: {
        photoType: "Photo Type",
        allPhotos: "All Photos",
        featuredOnly: "Featured Only",
        regularOnly: "Regular Only",
        tags: "Tags",
      },
    };
  }

  async getNavigation(): Promise<Navigation> {
    return {
      brandName: "Joel Photography",
      menuItems: [
        { name: "Home", href: "/", order: 0 },
        { name: "Explore", href: "/explore", order: 1 },
        { name: "About", href: "/about", order: 2 },
        { name: "Contact", href: "/contact", order: 3 },
      ],
      mobileMenuToggleLabel: "Toggle navigation menu",
    };
  }

  async getFooter(): Promise<Footer> {
    return {
      brandName: "Joel Photography",
      brandDescription: "Professional wildlife photography capturing nature's most beautiful and fleeting moments from expeditions around the world.",
      contactSectionTitle: "Get in Touch",
      email: "hello@joelphotography.com",
      location: "Based in Denver, Colorado, USA",
      phone: "+1 (555) 123-4567",
      quickLinksSectionTitle: "Quick Links",
      quickLinks: [
        { name: "Home", href: "/", order: 0 },
        { name: "Gallery", href: "/explore", order: 1 },
        { name: "About", href: "/about", order: 2 },
        { name: "Contact", href: "/contact", order: 3 },
      ],
      additionalSections: [
        {
          title: "Services",
          links: [
            { name: "Wildlife Photography", href: "/services/wildlife" },
            { name: "Nature Prints", href: "/services/prints" },
            { name: "Photography Tours", href: "/services/tours" },
          ],
        },
        {
          title: "Resources",
          links: [
            { name: "Photography Tips", href: "/blog" },
            { name: "Equipment Guide", href: "/equipment" },
            { name: "Conservation", href: "/conservation" },
          ],
        },
      ],
      copyrightText: "Joel Photography. All rights reserved.",
      tagline: "Capturing wild moments since 2014",
    };
  }
}