'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Photo } from '@/lib/cms/types';
import { ChevronLeft, ChevronRight, X, MapPin, Calendar } from 'lucide-react';

interface PhotoLightboxProps {
  photos: Photo[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function PhotoLightbox({
  photos,
  initialIndex,
  isOpen,
  onClose,
}: PhotoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Update current index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  }, [photos.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNext();
          break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToPrevious, goToNext, onClose]);

  if (!photos.length || currentIndex < 0 || currentIndex >= photos.length) {
    return null;
  }

  const currentPhoto = photos[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-0">
        <DialogTitle className="sr-only">{currentPhoto.title}</DialogTitle>
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Photo counter */}
          <div className="absolute top-4 left-4 z-50 text-white bg-black/50 px-3 py-1 rounded-md text-sm">
            {currentIndex + 1} of {photos.length}
          </div>

          {/* Previous button */}
          {photos.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {/* Next button */}
          {photos.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
              onClick={goToNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}

          {/* Main image container */}
          <div className="relative w-full h-full flex items-center justify-center p-16">
            <div className="relative max-w-full max-h-full">
              <Image
                src={currentPhoto.imageUrl}
                alt={currentPhoto.imageAlt}
                width={currentPhoto.metadata.width}
                height={currentPhoto.metadata.height}
                className="max-w-full max-h-full object-contain"
                priority
                sizes="95vw"
              />
            </div>
          </div>

          {/* Photo info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold text-white mb-2">
                {currentPhoto.title}
              </h2>

              {currentPhoto.description && (
                <p className="text-gray-200 mb-3 line-clamp-2">
                  {currentPhoto.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-3">
                {currentPhoto.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{currentPhoto.location}</span>
                  </div>
                )}
                {currentPhoto.dateTaken && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {currentPhoto.dateTaken.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>

              {currentPhoto.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {currentPhoto.tags.map((tag) => (
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
      </DialogContent>
    </Dialog>
  );
}