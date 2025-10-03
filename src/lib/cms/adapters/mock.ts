import { CMSAdapter } from '../interface';
import { Photo, PhotoCollection, QueryOptions } from '../types';

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
}