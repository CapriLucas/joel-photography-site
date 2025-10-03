import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { CMSAdapter } from "../interface";
import { Photo, PhotoCollection, QueryOptions } from "../types";

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
}
