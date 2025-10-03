'use client';

import { useState, useMemo } from 'react';
import { Camera } from 'lucide-react';
import PhotoGrid from '@/components/photo-grid';
import PhotoFilters from '@/components/photo-filters';
import { Photo, ExplorePage } from '@/lib/cms/types';

interface ExploreClientProps {
  initialPhotos: Photo[];
  pageContent: ExplorePage;
}

export default function ExploreClient({ initialPhotos, pageContent }: ExploreClientProps) {
  const [photos] = useState<Photo[]>(initialPhotos);
  const [loading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [featuredFilter, setFeaturedFilter] = useState<boolean | undefined>(undefined);

  // Photos are now loaded server-side and passed as props

  // Get all unique tags from photos
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    photos.forEach(photo => {
      photo.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [photos]);

  // Filter photos based on current filters
  const filteredPhotos = useMemo(() => {
    return photos.filter(photo => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          photo.title.toLowerCase().includes(query) ||
          photo.description?.toLowerCase().includes(query) ||
          photo.location?.toLowerCase().includes(query) ||
          photo.tags.some(tag => tag.toLowerCase().includes(query));

        if (!matchesSearch) return false;
      }

      // Featured filter
      if (featuredFilter !== undefined) {
        if (photo.featured !== featuredFilter) return false;
      }

      // Tags filter
      if (selectedTags.length > 0) {
        const hasSelectedTag = selectedTags.some(tag => photo.tags.includes(tag));
        if (!hasSelectedTag) return false;
      }

      return true;
    });
  }, [photos, searchQuery, selectedTags, featuredFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">{pageContent.loadingText}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            {pageContent.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {pageContent.description}
          </p>
          <div className="mt-4 text-sm text-gray-500">
            {photos.length} photos • {filteredPhotos.length} showing
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <PhotoFilters
            searchQuery={searchQuery}
            selectedTags={selectedTags}
            featuredFilter={featuredFilter}
            availableTags={availableTags}
            onSearchChange={setSearchQuery}
            onTagsChange={setSelectedTags}
            onFeaturedChange={setFeaturedFilter}
            filterLabels={pageContent.filterLabels}
            searchPlaceholder={pageContent.searchPlaceholder}
            filtersButtonText={pageContent.filtersButtonText}
            activeFiltersText={pageContent.activeFiltersText}
            clearAllFiltersText={pageContent.clearAllFiltersText}
          />
        </div>

        {/* Photo Grid */}
        {filteredPhotos.length > 0 ? (
          <PhotoGrid photos={filteredPhotos} />
        ) : (
          <div className="text-center py-12">
            <Camera className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {pageContent.emptyStateTitle}
            </h3>
            <p className="mt-2 text-gray-500">
              {pageContent.emptyStateDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}