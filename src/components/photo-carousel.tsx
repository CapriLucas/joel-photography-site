'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Photo } from '@/lib/cms/types';
import { MapPin, Calendar } from 'lucide-react';

interface PhotoCarouselProps {
  photos: Photo[];
  className?: string;
}

export default function PhotoCarousel({ photos, className }: PhotoCarouselProps) {
  if (!photos.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No photos available</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <Carousel className="w-full">
        <CarouselContent>
          {photos.map((photo) => (
            <CarouselItem key={photo.id}>
              <Card className="border-0 shadow-none">
                <CardContent className="p-0">
                  <div className="relative group">
                    {/* Main Image */}
                    <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                      <Image
                        src={photo.imageUrl}
                        alt={photo.imageAlt}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                        priority
                      />

                      {/* Overlay with photo info */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-6 left-6 right-6 text-white">
                          <h3 className="text-2xl font-bold mb-2">{photo.title}</h3>
                          {photo.description && (
                            <p className="text-gray-200 mb-3 line-clamp-2">
                              {photo.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            {photo.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{photo.location}</span>
                              </div>
                            )}
                            {photo.dateTaken && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {photo.dateTaken.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              </div>
                            )}
                          </div>

                          {photo.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {photo.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
}