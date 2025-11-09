// @ts-nocheck - Temporary fix for React component type compatibility issues
'use client';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Problem,
  ProblemSearchParams,
  ProblemSearchResult,
  ProblemCategory,
  ProblemDifficulty,
  PROBLEM_CATEGORIES,
  PROBLEM_DIFFICULTIES,
} from '@/types/problem';
import { ProblemCard } from '@/components/problems/ProblemCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import problemService from '@/services/problemService';
import Header from '@/components/layout/Header';
import Link from 'next/link';
import { Search, Filter, Plus, Grid, List, SortAsc, SortDesc, X, BookOpen } from 'lucide-react';

export default function ProblemsPage() {
  const [searchResult, setSearchResult] = useState<ProblemSearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProblemCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ProblemDifficulty | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filtersInitialized, setFiltersInitialized] = useState(false);

  const PAGE_SIZE = 24;
  const activeRequest = useRef<AbortController | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Load initial search params from URL
  useEffect(() => {
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');
    const page = searchParams.get('page');
    const sort = searchParams.get('sort');
    const order = searchParams.get('order');

    if (category && category in ProblemCategory) {
      setSelectedCategory(category as ProblemCategory);
    }
    if (difficulty && difficulty in ProblemDifficulty) {
      setSelectedDifficulty(difficulty as ProblemDifficulty);
    }
    if (search) {
      setSearchTerm(search);
    }
    if (page) {
      setCurrentPage(parseInt(page) || 1);
    }
    if (sort) {
      setSortBy(sort);
    }
    if (order && (order === 'asc' || order === 'desc')) {
      setSortOrder(order);
    }

    setFiltersInitialized(true);
  }, [searchParams]);

  // Search problems when filters change
  useEffect(() => {
    if (!filtersInitialized) return;
    searchProblems();
  }, [selectedCategory, selectedDifficulty, selectedTags, sortBy, sortOrder, currentPage, filtersInitialized]);

  const searchProblems = async (searchTermParam?: string) => {
    if (!filtersInitialized) return;
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    setLoading(true);
    try {
      const currentSearchTerm = searchTermParam !== undefined ? searchTermParam : searchTerm;
      const params: ProblemSearchParams = {
        page: currentPage,
        limit: PAGE_SIZE,
        sortBy: sortBy as any,
        sortOrder,
        ...(selectedCategory !== 'all' && { category: selectedCategory as string }),
        ...(selectedDifficulty !== 'all' && {
          difficulty: selectedDifficulty as ProblemDifficulty,
        }),
        ...(selectedTags.length > 0 && { tags: selectedTags }),
      };

      try {
        let result: ProblemSearchResult;
        if (currentSearchTerm && currentSearchTerm.trim()) {
          result = await problemService.searchProblems(
            { ...params, q: currentSearchTerm.trim() },
            { signal: controller.signal }
          );
        } else {
          result = await problemService.getProblems(params, { signal: controller.signal });
        }
        if (controller.signal.aborted) return;
        setSearchResult(result);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error('Failed to load problems:', error);
        // Set empty result to show "no problems found" state
        setSearchResult({
          problems: [],
          pagination: {
            page: 1,
            limit: PAGE_SIZE,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        });
      }

      // Update URL with search params
      const urlParams = new URLSearchParams();
      if (currentSearchTerm) urlParams.set('search', currentSearchTerm);
      if (selectedCategory !== 'all') urlParams.set('category', selectedCategory);
      if (selectedDifficulty !== 'all') urlParams.set('difficulty', selectedDifficulty);
      if (currentPage > 1) urlParams.set('page', currentPage.toString());
      if (sortBy !== 'createdAt') urlParams.set('sort', sortBy);
      if (sortOrder !== 'desc') urlParams.set('order', sortOrder);

      const newUrl = `?${urlParams.toString()}`;
      if (newUrl !== `?${searchParams.toString()}`) {
        router.replace(newUrl, { scroll: false });
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    searchProblems(searchTerm);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSelectedTags([]);
    setSearchTerm('');
    setCurrentPage(1);
    setSortBy('createdAt');
    setSortOrder('desc');
    router.replace('/problems');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedDifficulty !== 'all' ||
    selectedTags.length > 0 ||
    searchTerm;

  useEffect(() => {
    return () => {
      activeRequest.current?.abort();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Math Problems</h1>
            <p className="text-gray-600 mt-2">
              Discover and solve mathematical problems across all topics
            </p>
          </div>
          <Link href="/problems/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Problem
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search problems by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={loading}>
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-gray-100' : ''}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </form>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Filters</CardTitle>
                {hasActiveFilters && (
                  <Button variant="ghost" onClick={clearFilters} className="text-red-600">
                    <X className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => {
                      setSelectedCategory(value as ProblemCategory | 'all');
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {Object.entries(PROBLEM_CATEGORIES).map(([key, category]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <Select
                    value={selectedDifficulty}
                    onValueChange={(value) => {
                      setSelectedDifficulty(value as ProblemDifficulty | 'all');
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      {Object.entries(PROBLEM_DIFFICULTIES).map(([key, difficulty]) => (
                        <SelectItem key={key} value={key}>
                          <Badge variant="outline" className={`${difficulty.color} border-current`}>
                            {difficulty.name}
                          </Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <div className="flex gap-2">
                    <Select
                      value={sortBy}
                      onValueChange={(value) => {
                        setSortBy(value);
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="createdAt">Date Created</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="difficulty">Difficulty</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="popularity">Popularity</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-3"
                    >
                      {sortOrder === 'asc' ? (
                        <SortAsc className="w-4 h-4" />
                      ) : (
                        <SortDesc className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Popular Tags */}
              {searchResult?.facets.popularTags && searchResult.facets.popularTags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Popular Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {searchResult.facets.popularTags.map((tagData) => (
                      <Badge
                        key={tagData.tag}
                        variant={selectedTags.includes(tagData.tag) ? 'default' : 'outline'}
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => handleTagToggle(tagData.tag)}
                      >
                        {tagData.tag} ({tagData.count})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* View Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {searchResult && (
              <p className="text-gray-600">{searchResult.pagination.total} problems found</p>
            )}
            {hasActiveFilters && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Active filters:</span>
                <div className="flex gap-2">
                  {selectedCategory !== 'all' && (
                    <Badge variant="secondary" className="gap-1">
                      {PROBLEM_CATEGORIES[selectedCategory as ProblemCategory].name}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setSelectedCategory('all')}
                      />
                    </Badge>
                  )}
                  {selectedDifficulty !== 'all' && (
                    <Badge variant="secondary" className="gap-1">
                      {PROBLEM_DIFFICULTIES[selectedDifficulty as ProblemDifficulty].name}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setSelectedDifficulty('all')}
                      />
                    </Badge>
                  )}
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => handleTagToggle(tag)} />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Problems Grid/List */}
        {loading ? (
          <div
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}
          >
            {Array.from({ length: 8 }, (_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex gap-2 mb-3">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-4 w-1/2" />
              </Card>
            ))}
          </div>
        ) : searchResult?.problems.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="mb-4">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Problems Available</h2>
              <p className="text-gray-600 mb-2">
                {hasActiveFilters
                  ? 'No problems match your current search criteria.'
                  : 'The problem database is not currently available.'}
              </p>
              <p className="text-sm text-gray-500">
                This happens when the backend server is not running. You can still explore the UI!
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
              <Link href="/problems/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Try Create Form
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <>
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'
              }`}
            >
              {searchResult?.problems.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  compact={viewMode === 'list'}
                  onFavoriteToggle={(problemId, isFavorited) => {
                    // Update the problem in the list
                    if (searchResult) {
                      const updatedProblems = searchResult.problems.map((p) =>
                        p.id === problemId ? { ...p, isFavorited } : p
                      );
                      setSearchResult({ ...searchResult, problems: updatedProblems });
                    }
                  }}
                  onBookmarkToggle={(problemId, isBookmarked) => {
                    // Update the problem in the list
                    if (searchResult) {
                      const updatedProblems = searchResult.problems.map((p) =>
                        p.id === problemId ? { ...p, isBookmarked } : p
                      );
                      setSearchResult({ ...searchResult, problems: updatedProblems });
                    }
                  }}
                />
              ))}
            </div>

            {/* Pagination */}
            {searchResult && searchResult.pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from(
                    { length: Math.min(5, searchResult.pagination.totalPages) },
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          className="w-10 h-10 p-0"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}
                  {searchResult.pagination.totalPages > 5 && (
                    <>
                      <span className="px-2 py-2">...</span>
                      <Button
                        variant="outline"
                        className="w-10 h-10 p-0"
                        onClick={() => setCurrentPage(searchResult.pagination.totalPages)}
                      >
                        {searchResult.pagination.totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  disabled={currentPage === searchResult.pagination.totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
