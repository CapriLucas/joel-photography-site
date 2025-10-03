import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { CMSAdapter } from "../interface";
import {
  Photo,
  PhotoCollection,
  QueryOptions,
  SiteSettings,
  HomePage,
  ExplorePage,
  Navigation,
  Footer,
} from "../types";

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: true,
  apiVersion: "2024-01-01",
});

const builder = imageUrlBuilder(client);

interface SanityImage {
  asset?: {
    _id: string;
    url: string;
    metadata?: {
      dimensions?: {
        width: number;
        height: number;
      };
    };
    mimeType?: string;
  };
  alt?: string;
}

interface SanityPhoto {
  _id: string;
  title?: string;
  description?: string;
  image?: SanityImage;
  location?: string;
  dateTaken?: string;
  tags?: string[];
  featured?: boolean;
}

interface SanityCollection {
  _id: string;
  name: string;
  description?: string;
  photos: SanityPhoto[];
}

export class SanityAdapter implements CMSAdapter {
  private urlFor(source: SanityImage) {
    return builder.image(source);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private convertPortableTextToString(portableText: any[]): string {
    if (!portableText || !Array.isArray(portableText)) return "";

    return portableText
      .map((block) => {
        if (block._type === "block" && block.children) {
          return (
            block.children
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map((child: any) => {
                let text = child.text || "";

                // Apply formatting based on marks
                if (child.marks && child.marks.length > 0) {
                  child.marks.forEach((mark: string) => {
                    switch (mark) {
                      case "strong":
                        text = `**${text}**`;
                        break;
                      case "em":
                        text = `*${text}*`;
                        break;
                      case "underline":
                        text = `<u>${text}</u>`;
                        break;
                      case "code":
                        text = `\`${text}\``;
                        break;
                    }
                  });
                }

                return text;
              })
              .join("")
          );
        }
        return "";
      })
      .join("\n\n")
      .trim();
  }

  private transformSanityPhoto(sanityPhoto: SanityPhoto): Photo {
    // Check if image and asset exist before trying to generate URL
    const hasValidImage =
      sanityPhoto.image?.asset?._id || sanityPhoto.image?.asset?.url;
    const imageUrl = hasValidImage ? this.urlFor(sanityPhoto.image!).url() : "";

    return {
      id: sanityPhoto._id,
      title: sanityPhoto.title || "",
      description: sanityPhoto.description || "",
      imageUrl,
      imageAlt: sanityPhoto.image?.alt || sanityPhoto.title || "",
      location: sanityPhoto.location || "",
      dateTaken: sanityPhoto.dateTaken
        ? new Date(sanityPhoto.dateTaken)
        : undefined,
      tags: sanityPhoto.tags || [],
      featured: sanityPhoto.featured || false,
      metadata: {
        width: sanityPhoto.image?.asset?.metadata?.dimensions?.width || 0,
        height: sanityPhoto.image?.asset?.metadata?.dimensions?.height || 0,
        format: sanityPhoto.image?.asset?.mimeType?.split("/")[1] || "jpg",
      },
    };
  }

  async getPhotos(options: QueryOptions = {}): Promise<Photo[]> {
    try {
      let query = `*[_type == "photo" && defined(image.asset)`;

      if (options.featured !== undefined) {
        query += ` && featured == ${options.featured}`;
      }

      if (options.tags && options.tags.length > 0) {
        const tagFilter = options.tags
          .map((tag) => `"${tag}" in tags`)
          .join(" || ");
        query += ` && (${tagFilter})`;
      }

      query += `] {
        _id,
        title,
        description,
        image {
          asset-> {
            _id,
            url,
            metadata {
              dimensions {
                width,
                height
              }
            },
            mimeType
          },
          alt
        },
        location,
        dateTaken,
        tags,
        featured
      }`;

      if (options.limit) {
        query += `[0..${options.limit - 1}]`;
      }

      const results: SanityPhoto[] = await client.fetch(query);
      return results.map((photo) => this.transformSanityPhoto(photo));
    } catch (error) {
      console.error("Error fetching photos from Sanity:", error);
      return [];
    }
  }

  async getFeaturedPhotos(): Promise<Photo[]> {
    return this.getPhotos({ featured: true });
  }

  async getPhotoById(id: string): Promise<Photo | null> {
    try {
      const query = `*[_type == "photo" && _id == $id && defined(image.asset)][0] {
        _id,
        title,
        description,
        image {
          asset-> {
            _id,
            url,
            metadata {
              dimensions {
                width,
                height
              }
            },
            mimeType
          },
          alt
        },
        location,
        dateTaken,
        tags,
        featured
      }`;

      const result: SanityPhoto | null = await client.fetch(query, { id });
      return result ? this.transformSanityPhoto(result) : null;
    } catch (error) {
      console.error("Error fetching photo by ID from Sanity:", error);
      return null;
    }
  }

  async getCollections(): Promise<PhotoCollection[]> {
    try {
      const query = `*[_type == "collection"] {
        _id,
        name,
        description,
        "photos": photos[]-> {
          _id,
          title,
          description,
          image {
            asset-> {
              _id,
              url,
              metadata {
                dimensions {
                  width,
                  height
                }
              },
              mimeType
            },
            alt
          },
          location,
          dateTaken,
          tags,
          featured
        }
      }`;

      const results: SanityCollection[] = await client.fetch(query);
      return results.map((collection) => ({
        id: collection._id,
        name: collection.name,
        description: collection.description,
        photos: collection.photos.map((photo) =>
          this.transformSanityPhoto(photo)
        ),
      }));
    } catch (error) {
      console.error("Error fetching collections from Sanity:", error);
      return [];
    }
  }

  async searchPhotos(searchQuery: string): Promise<Photo[]> {
    try {
      const query = `*[_type == "photo" && (
        title match $searchQuery ||
        description match $searchQuery ||
        location match $searchQuery ||
        $searchQuery in tags
      )] {
        _id,
        title,
        description,
        image {
          asset-> {
            _id,
            url,
            metadata {
              dimensions {
                width,
                height
              }
            },
            mimeType
          },
          alt
        },
        location,
        dateTaken,
        tags,
        featured
      }`;

      const results: SanityPhoto[] = await client.fetch(query, {
        searchQuery: `*${searchQuery}*`,
      });
      return results.map((photo) => this.transformSanityPhoto(photo));
    } catch (error) {
      console.error("Error searching photos in Sanity:", error);
      return [];
    }
  }

  async getSiteSettings(): Promise<SiteSettings> {
    try {
      const query = `*[_type == "siteSettings" && _id == "siteSettings"][0] {
        siteName,
        siteDescription,
        siteUrl,
        defaultMetaTitle,
        defaultMetaDescription,
        socialMedia,
        googleAnalyticsId,
        favicon { asset-> { url } },
        logo { asset-> { url } }
      }`;

      const result = await client.fetch(query);

      if (!result) {
        // Return error values if no settings found
        return {
          siteName: "[SANITY ERROR: siteSettings document not found]",
          siteDescription:
            "[SANITY ERROR: Create siteSettings in Sanity Studio]",
          siteUrl: "",
          defaultMetaTitle: "[SANITY ERROR: No meta title configured]",
          defaultMetaDescription:
            "[SANITY ERROR: No meta description configured]",
          socialMedia: {},
        };
      }

      return {
        siteName: result.siteName || "[SANITY ERROR: Site name not configured]",
        siteDescription:
          result.siteDescription ||
          "[SANITY ERROR: Site description not configured]",
        siteUrl: result.siteUrl || "",
        defaultMetaTitle:
          result.defaultMetaTitle ||
          "[SANITY ERROR: Meta title not configured]",
        defaultMetaDescription:
          result.defaultMetaDescription ||
          "[SANITY ERROR: Meta description not configured]",
        socialMedia: result.socialMedia || {},
        googleAnalyticsId: result.googleAnalyticsId,
        favicon: result.favicon?.asset?.url,
        logo: result.logo?.asset?.url,
      };
    } catch (error) {
      console.error("Error fetching site settings from Sanity:", error);
      return {
        siteName: "[SANITY CONNECTION ERROR: Cannot fetch site name]",
        siteDescription:
          "[SANITY CONNECTION ERROR: Cannot fetch site description]",
        siteUrl: "",
        defaultMetaTitle: "[SANITY CONNECTION ERROR: Cannot fetch meta title]",
        defaultMetaDescription:
          "[SANITY CONNECTION ERROR: Cannot fetch meta description]",
        socialMedia: {},
      };
    }
  }

  async getHomePage(): Promise<HomePage> {
    try {
      const query = `*[_type == "homePage" && _id == "homePage"][0] {
        heroTitle,
        heroSubtitle,
        heroDescription,
        heroButtons[] {
          text,
          link,
          style,
          icon
        },
        featuredSectionTitle,
        featuredSectionDescription,
        featuredEmptyStateTitle,
        featuredEmptyStateDescription,
        aboutTitle,
        aboutText,
        aboutButtonText,
        aboutButtonLink,
        statsCardTitle,
        statsCardSubtitle,
        statistics[] {
          number,
          label
        }
      }`;

      const result = await client.fetch(query);

      if (!result) {
        // Return error values if no content found
        return {
          heroSection: {
            title: "[SANITY DOCUMENT ERROR: homePage document not found]",
            subtitle:
              "[SANITY DOCUMENT ERROR: Create homePage document in Sanity Studio]",
            description: "[SANITY DOCUMENT ERROR: Missing hero description]",
            buttons: [],
          },
          featuredSection: {
            title: "[SANITY DOCUMENT ERROR: Featured section not configured]",
            description:
              "[SANITY DOCUMENT ERROR: Configure featured section in Sanity]",
            showFeaturedPhotos: true,
          },
          aboutSection: {
            title: "[SANITY DOCUMENT ERROR: About section not configured]",
            description:
              "[SANITY DOCUMENT ERROR: Configure about section in Sanity]",
            ctaText: "[SANITY ERROR: No CTA configured]",
            ctaLink: "/explore",
          },
          statsCard: {
            title: "[SANITY DOCUMENT ERROR: Stats card not configured]",
            subtitle: "[SANITY DOCUMENT ERROR: Configure stats card in Sanity]",
            statistics: [],
          },
        };
      }

      return {
        heroSection: {
          title: result.heroTitle || "[SANITY ERROR: Hero title not found]",
          subtitle:
            result.heroSubtitle || "[SANITY ERROR: Hero subtitle not found]",
          description:
            result.heroDescription ||
            "[SANITY ERROR: Hero description not found]",
          buttons: result.heroButtons || [],
        },
        featuredSection: {
          title:
            result.featuredSectionTitle ||
            "[SANITY ERROR: Featured title not found]",
          description:
            result.featuredSectionDescription ||
            "[SANITY ERROR: Featured description not found]",
          showFeaturedPhotos: true,
        },
        aboutSection: {
          title: result.aboutTitle || "[SANITY ERROR: About title not found]",
          description:
            this.convertPortableTextToString(result.aboutText) ||
            "[SANITY ERROR: About description not found]",
          ctaText:
            result.aboutButtonText ||
            "[SANITY ERROR: About CTA text not found]",
          ctaLink: result.aboutButtonLink || "/explore",
        },
        statsCard: {
          title:
            result.statsCardTitle ||
            "[SANITY ERROR: Stats card title not found]",
          subtitle:
            result.statsCardSubtitle ||
            "[SANITY ERROR: Stats card subtitle not found]",
          statistics: result.statistics || [],
        },
      };
    } catch (error) {
      console.error("Error fetching home page from Sanity:", error);
      return {
        heroSection: {
          title: "[SANITY CONNECTION ERROR: Cannot fetch hero title]",
          subtitle: "[SANITY CONNECTION ERROR: Cannot fetch hero subtitle]",
          description:
            "[SANITY CONNECTION ERROR: Cannot fetch hero description]",
          buttons: [
            {
              text: "[SANITY ERROR: Button not loaded]",
              link: "/explore",
              style: "primary" as const,
              icon: "none" as const,
            },
          ],
        },
        featuredSection: {
          title: "[SANITY CONNECTION ERROR: Cannot fetch featured title]",
          description:
            "[SANITY CONNECTION ERROR: Cannot fetch featured description]",
          showFeaturedPhotos: true,
        },
        aboutSection: {
          title: "[SANITY CONNECTION ERROR: Cannot fetch about title]",
          description:
            "[SANITY CONNECTION ERROR: Cannot fetch about description]",
          ctaText: "[SANITY ERROR: CTA not loaded]",
          ctaLink: "/explore",
        },
        statsCard: {
          title: "[SANITY CONNECTION ERROR: Cannot fetch stats title]",
          subtitle: "[SANITY CONNECTION ERROR: Cannot fetch stats subtitle]",
          statistics: [],
        },
      };
    }
  }

  async getExplorePage(): Promise<ExplorePage> {
    try {
      const query = `*[_type == "explorePage" && _id == "explorePage"][0] {
        title,
        description,
        loadingText,
        emptyStateTitle,
        emptyStateDescription,
        searchPlaceholder,
        filtersButtonText,
        activeFiltersText,
        clearAllFiltersText,
        filterLabels {
          photoType,
          allPhotos,
          featuredOnly,
          regularOnly,
          tags
        }
      }`;

      const result = await client.fetch(query);

      if (!result) {
        // Return default values if no content found
        return {
          title: "Explore Wildlife Photography",
          description:
            "Browse through our collection of stunning wildlife photographs",
          loadingText: "Loading photos...",
          emptyStateTitle: "No photos found",
          emptyStateDescription:
            "Try adjusting your search or filters to find more photos.",
          searchPlaceholder: "Search photos...",
          filtersButtonText: "Filters",
          activeFiltersText: "Active filters:",
          clearAllFiltersText: "Clear all",
          filterLabels: {
            photoType: "Photo Type",
            allPhotos: "All Photos",
            featuredOnly: "Featured Only",
            regularOnly: "Regular Only",
            tags: "Tags",
          },
        };
      }

      return {
        title: result.title || "Explore Wildlife Photography",
        description:
          result.description ||
          "Browse through our collection of stunning wildlife photographs",
        loadingText: result.loadingText || "Loading photos...",
        emptyStateTitle: result.emptyStateTitle || "No photos found",
        emptyStateDescription:
          result.emptyStateDescription ||
          "Try adjusting your search or filters to find more photos.",
        searchPlaceholder: result.searchPlaceholder || "Search photos...",
        filtersButtonText: result.filtersButtonText || "Filters",
        activeFiltersText: result.activeFiltersText || "Active filters:",
        clearAllFiltersText: result.clearAllFiltersText || "Clear all",
        filterLabels: {
          photoType: result.filterLabels?.photoType || "Photo Type",
          allPhotos: result.filterLabels?.allPhotos || "All Photos",
          featuredOnly: result.filterLabels?.featuredOnly || "Featured Only",
          regularOnly: result.filterLabels?.regularOnly || "Regular Only",
          tags: result.filterLabels?.tags || "Tags",
        },
      };
    } catch (error) {
      console.error("Error fetching explore page from Sanity:", error);
      return {
        title: "Explore Wildlife Photography",
        description:
          "Browse through our collection of stunning wildlife photographs",
        loadingText: "Loading photos...",
        emptyStateTitle: "No photos found",
        emptyStateDescription:
          "Try adjusting your search or filters to find more photos.",
        searchPlaceholder: "Search photos...",
        filtersButtonText: "Filters",
        activeFiltersText: "Active filters:",
        clearAllFiltersText: "Clear all",
        filterLabels: {
          photoType: "Photo Type",
          allPhotos: "All Photos",
          featuredOnly: "Featured Only",
          regularOnly: "Regular Only",
          tags: "Tags",
        },
      };
    }
  }

  async getNavigation(): Promise<Navigation> {
    try {
      const query = `*[_type == "navigation" && _id == "navigation"][0] {
        brandName,
        menuItems[] {
          name,
          href,
          order
        },
        mobileMenuToggleLabel
      }`;

      const result = await client.fetch(query);

      if (!result) {
        // Return error values if no content found
        return {
          brandName: "[SANITY ERROR: navigation document not found]",
          menuItems: [
            { name: "[SANITY ERROR: No menu items]", href: "/", order: 0 },
          ],
          mobileMenuToggleLabel: "[SANITY ERROR: No toggle label]",
        };
      }

      return {
        brandName:
          result.brandName || "[SANITY ERROR: Brand name not configured]",
        menuItems: result.menuItems
          ? result.menuItems.sort(
              (a: { order: number }, b: { order: number }) => a.order - b.order
            )
          : [{ name: "[SANITY ERROR: No menu items]", href: "/", order: 0 }],
        mobileMenuToggleLabel:
          result.mobileMenuToggleLabel || "[SANITY ERROR: No toggle label]",
      };
    } catch (error) {
      console.error("Error fetching navigation from Sanity:", error);
      return {
        brandName: "[SANITY CONNECTION ERROR: Cannot fetch brand name]",
        menuItems: [
          {
            name: "[SANITY CONNECTION ERROR: Cannot fetch menu]",
            href: "/",
            order: 0,
          },
        ],
        mobileMenuToggleLabel:
          "[SANITY CONNECTION ERROR: Cannot fetch toggle label]",
      };
    }
  }

  async getFooter(): Promise<Footer> {
    try {
      const query = `*[_type == "footer" && _id == "footer"][0] {
        brandName,
        brandDescription,
        contactSectionTitle,
        email,
        location,
        phone,
        quickLinksSectionTitle,
        quickLinks[] {
          name,
          href,
          order
        },
        additionalSections[] {
          title,
          links[] {
            name,
            href
          }
        },
        copyrightText,
        tagline
      }`;

      const result = await client.fetch(query);

      if (!result) {
        // Return default values if no content found
        return {
          brandName: "Joel Photography",
          brandDescription:
            "Professional wildlife photography capturing nature's most beautiful moments.",
          contactSectionTitle: "Contact",
          email: "contact@joelphotography.com",
          location: "Based in Colorado, USA",
          quickLinksSectionTitle: "Quick Links",
          quickLinks: [
            { name: "Home", href: "/", order: 0 },
            { name: "Explore", href: "/explore", order: 1 },
          ],
          additionalSections: [],
          copyrightText: "Joel Photography. All rights reserved.",
          tagline: "Capturing wild moments since 2020",
        };
      }

      return {
        brandName: result.brandName || "Joel Photography",
        brandDescription:
          result.brandDescription ||
          "Professional wildlife photography capturing nature's most beautiful moments.",
        contactSectionTitle: result.contactSectionTitle || "Contact",
        email: result.email || "contact@joelphotography.com",
        location: result.location || "Based in Colorado, USA",
        phone: result.phone,
        quickLinksSectionTitle: result.quickLinksSectionTitle || "Quick Links",
        quickLinks: result.quickLinks
          ? result.quickLinks.sort(
              (a: { order: number }, b: { order: number }) => a.order - b.order
            )
          : [
              { name: "Home", href: "/", order: 0 },
              { name: "Explore", href: "/explore", order: 1 },
            ],
        additionalSections: result.additionalSections || [],
        copyrightText:
          result.copyrightText || "Joel Photography. All rights reserved.",
        tagline: result.tagline || "Capturing wild moments since 2020",
      };
    } catch (error) {
      console.error("Error fetching footer from Sanity:", error);
      return {
        brandName: "Joel Photography",
        brandDescription:
          "Professional wildlife photography capturing nature's most beautiful moments.",
        contactSectionTitle: "Contact",
        email: "contact@joelphotography.com",
        location: "Based in Colorado, USA",
        quickLinksSectionTitle: "Quick Links",
        quickLinks: [
          { name: "Home", href: "/", order: 0 },
          { name: "Explore", href: "/explore", order: 1 },
        ],
        additionalSections: [],
        copyrightText: "Joel Photography. All rights reserved.",
        tagline: "Capturing wild moments since 2020",
      };
    }
  }
}
