import { CMSAdapter, CMSType } from './interface';
import { SanityAdapter } from './adapters/sanity';
import { MockAdapter } from './adapters/mock';

export class CMSClient {
  private adapter: CMSAdapter;

  constructor(cmsType: CMSType = 'sanity') {
    switch (cmsType) {
      case 'sanity':
        // Use mock adapter if Sanity is not configured
        if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'demo-project') {
          console.warn('Sanity not configured, using mock data. Set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local');
          this.adapter = new MockAdapter();
        } else {
          this.adapter = new SanityAdapter();
        }
        break;
      case 'local':
        this.adapter = new MockAdapter();
        break;
      // Future CMS adapters can be added here
      // case 'strapi':
      //   this.adapter = new StrapiAdapter();
      //   break;
      // case 'contentful':
      //   this.adapter = new ContentfulAdapter();
      //   break;
      default:
        throw new Error(`Unsupported CMS type: ${cmsType}`);
    }
  }

  async getPhotos(options?: import('./types').QueryOptions) {
    return this.adapter.getPhotos(options);
  }

  async getFeaturedPhotos() {
    return this.adapter.getFeaturedPhotos();
  }

  async getPhotoById(id: string) {
    return this.adapter.getPhotoById(id);
  }

  async getCollections() {
    return this.adapter.getCollections();
  }

  async searchPhotos(query: string) {
    return this.adapter.searchPhotos(query);
  }
}

// Global CMS client instance
const cmsType = (process.env.NEXT_PUBLIC_CMS_TYPE as CMSType) || 'sanity';
export const cmsClient = new CMSClient(cmsType);