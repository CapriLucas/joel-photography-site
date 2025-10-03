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