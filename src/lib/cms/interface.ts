import { Photo, PhotoCollection, QueryOptions, SiteSettings, HomePage, ExplorePage, Navigation, Footer } from './types';

export interface CMSAdapter {
  // Photo methods
  getPhotos(options?: QueryOptions): Promise<Photo[]>;
  getFeaturedPhotos(): Promise<Photo[]>;
  getPhotoById(id: string): Promise<Photo | null>;
  getCollections(): Promise<PhotoCollection[]>;
  searchPhotos(query: string): Promise<Photo[]>;

  // Site content methods
  getSiteSettings(): Promise<SiteSettings>;
  getHomePage(): Promise<HomePage>;
  getExplorePage(): Promise<ExplorePage>;
  getNavigation(): Promise<Navigation>;
  getFooter(): Promise<Footer>;
}

export type CMSType = 'sanity' | 'strapi' | 'contentful' | 'local';