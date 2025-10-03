'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import PhotoLightbox from '@/components/photo-lightbox';
import { Photo } from '@/lib/cms/types';
import { MapPin, Calendar } from 'lucide-react';

interface PhotoGridProps {
  photos: Photo[];
  className?: string;
}

export default function PhotoGrid({ photos, className }: PhotoGridProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(-1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedPhotoIndex(-1);
  };

  if (!photos.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No photos found</p>
      </div>
    );
  }

  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {photos.map((photo, index) => (
          <Card
            key={photo.id}
            className="group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300"
            onClick={() => openLightbox(index)}
          >
            <CardContent className="p-0">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={photo.imageUrl}
                  alt={photo.imageAlt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                {/* Featured badge */}
                {photo.featured && (
                  <Badge className="absolute top-3 left-3 bg-white/90 text-gray-900 hover:bg-white">
                    Featured
                  </Badge>
                )}
              </div>

              {/* Photo info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
                  {photo.title}
                </h3>
                {photo.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {photo.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                  {photo.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{photo.location}</span>
                    </div>
                  )}
                  {photo.dateTaken && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {photo.dateTaken.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {photo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {photo.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {photo.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{photo.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PhotoLightbox
        photos={photos}
        initialIndex={selectedPhotoIndex}
        isOpen={isLightboxOpen}
        onClose={closeLightbox}
      />
    </>
  );
}