'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, BookOpen, GraduationCap, FileText, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';
import resourceService from '@/services/resourceService';
import {
  Resource,
  ResourceSearchParams,
  ResourceType,
  DifficultyLevel,
  RESOURCE_CATEGORIES,
  RESOURCE_TYPES,
  DIFFICULTY_LEVELS,
  getResourceTypeIcon,
  getDifficultyInfo,
} from '@/types/resource';

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Most Recent' },
  { value: 'viewCount', label: 'Most Viewed' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'title', label: 'Alphabetical' },
];

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ResourceSearchParams>({
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Fetch resources
  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = searchQuery ? { ...filters, query: searchQuery } : filters;

      const result = searchQuery
        ? await resourceService.searchResources(searchParams as any)
        : await resourceService.getResources(searchParams);

      setResources(result.resources);
      setPagination(result.pagination);
    } catch (err) {
      setError('Failed to fetch resources. Please try again.');
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [filters]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    fetchResources();
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof ResourceSearchParams, value: any) => {
    setFilters({
      ...filters,
      [key]: value,
      page: 1, // Reset to first page when changing filters
    });
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Learning Resources
              </h1>
              <p className="text-gray-600 mt-2">
                Discover tutorials, guides, and reference materials to enhance your math skills
              </p>
            </div>
            <Link href="/resources/create">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Resource
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" variant="outline">
                  Search
                </Button>
              </div>
            </form>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-700">Filters:</span>
              </div>

              <Select
                value={filters.category || ''}
                onValueChange={(value) => handleFilterChange('category', value || undefined)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {RESOURCE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.type || ''}
                onValueChange={(value) => handleFilterChange('type', value as ResourceType)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {RESOURCE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.difficulty || ''}
                onValueChange={(value) =>
                  handleFilterChange('difficulty', value as DifficultyLevel)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Difficulties</SelectItem>
                  {DIFFICULTY_LEVELS.map((difficulty) => (
                    <SelectItem key={difficulty.value} value={difficulty.value}>
                      {difficulty.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onValueChange={(value) => {
                  const [sortBy, sortOrder] = value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <React.Fragment key={option.value}>
                      <SelectItem value={`${option.value}-desc`}>{option.label}</SelectItem>
                      {option.value !== 'createdAt' && (
                        <SelectItem value={`${option.value}-asc`}>
                          {option.label} (Ascending)
                        </SelectItem>
                      )}
                    </React.Fragment>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={fetchResources}>
                Retry
              </Button>
            </div>
          </Alert>
        )}

        {/* Results Count */}
        {!loading && (
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {resources.length} of {pagination.total} resources
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
        )}

        {/* Resources Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : resources.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchQuery ? 'No resources found' : 'No resources available'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? 'Try adjusting your search criteria or filters'
                  : 'Be the first to create a learning resource for the community'}
              </p>
              {!searchQuery && (
                <Link href="/resources/create">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Resource
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <Button
              variant="outline"
              disabled={!pagination.hasPrev}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Previous
            </Button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={pagination.page === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              disabled={!pagination.hasNext}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Resource Card Component
function ResourceCard({ resource }: { resource: Resource }) {
  const difficultyInfo = getDifficultyInfo(resource.difficulty);
  const typeIcon = getResourceTypeIcon(resource.type);

  return (
    <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{typeIcon}</span>
            <Badge variant="outline" className="text-xs">
              {resource.type}
            </Badge>
          </div>
          {resource.difficulty && (
            <Badge className={`text-xs ${difficultyInfo.color}`}>{difficultyInfo.label}</Badge>
          )}
        </div>
        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
          <Link href={`/resources/${resource.id}`}>{resource.title}</Link>
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>By {resource.author.username}</span>
          <span>•</span>
          <span>{resource.viewCount} views</span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {resourceService.getResourceSummary(resource.content, 120)}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {resource.category}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>⭐ {resource.rating.toFixed(1)}</span>
            {resource._count.bookmarks > 0 && <span>📖 {resource._count.bookmarks}</span>}
          </div>
        </div>

        <div className="mt-4">
          <Link href={`/resources/${resource.id}`}>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              View Resource
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
