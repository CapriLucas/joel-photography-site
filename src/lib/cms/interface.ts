import { Photo, PhotoCollection, QueryOptions } from './types';

export interface CMSAdapter {
  getPhotos(options?: QueryOptions): Promise<Photo[]>;
  getFeaturedPhotos(): Promise<Photo[]>;
  getPhotoById(id: string): Promise<Photo | null>;
  getCollections(): Promise<PhotoCollection[]>;
  searchPhotos(query: string): Promise<Photo[]>;
}

export type CMSType = 'sanity' | 'strapi' | 'contentful' | 'local';