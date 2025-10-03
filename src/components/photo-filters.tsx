'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface PhotoFiltersProps {
  onSearchChange: (search: string) => void;
  onTagsChange: (tags: string[]) => void;
  onFeaturedChange: (featured: boolean | undefined) => void;
  availableTags: string[];
  selectedTags: string[];
  searchQuery: string;
  featuredFilter: boolean | undefined;
}

export default function PhotoFilters({
  onSearchChange,
  onTagsChange,
  onFeaturedChange,
  availableTags,
  selectedTags,
  searchQuery,
  featuredFilter,
}: PhotoFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    onTagsChange(newTags);
  };

  const clearAllFilters = () => {
    onSearchChange('');
    onTagsChange([]);
    onFeaturedChange(undefined);
  };

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || featuredFilter !== undefined;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search photos by title, description, location, or tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
              {(selectedTags.length + (featuredFilter !== undefined ? 1 : 0))}
            </Badge>
          )}
        </Button>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>

          {featuredFilter !== undefined && (
            <Badge variant="outline" className="flex items-center gap-1">
              {featuredFilter ? 'Featured' : 'Not Featured'}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onFeaturedChange(undefined)}
              />
            </Badge>
          )}

          {selectedTags.map((tag) => (
            <Badge key={tag} variant="outline" className="flex items-center gap-1">
              {tag}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleTagToggle(tag)}
              />
            </Badge>
          ))}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Expanded Filters */}
      {showFilters && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Filter Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Featured Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Photo Type</h4>
              <div className="flex gap-2">
                <Button
                  variant={featuredFilter === undefined ? "default" : "outline"}
                  size="sm"
                  onClick={() => onFeaturedChange(undefined)}
                >
                  All Photos
                </Button>
                <Button
                  variant={featuredFilter === true ? "default" : "outline"}
                  size="sm"
                  onClick={() => onFeaturedChange(true)}
                >
                  Featured Only
                </Button>
                <Button
                  variant={featuredFilter === false ? "default" : "outline"}
                  size="sm"
                  onClick={() => onFeaturedChange(false)}
                >
                  Regular Only
                </Button>
              </div>
            </div>

            {/* Tags Filter */}
            {availableTags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Tags ({selectedTags.length} selected)
                </h4>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {availableTags.map((tag) => (
                    <Button
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTagToggle(tag)}
                      className="text-xs"
                    >
                      {tag}
                      {selectedTags.includes(tag) && (
                        <X className="ml-1 h-3 w-3" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}