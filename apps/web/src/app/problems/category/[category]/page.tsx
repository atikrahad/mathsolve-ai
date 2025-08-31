'use client';

// @ts-nocheck - Temporary fix for React component type compatibility issues
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import {
  Problem,
  ProblemCategory,
  ProblemDifficulty,
  ProblemSearchResult,
  PROBLEM_CATEGORIES,
  PROBLEM_DIFFICULTIES,
} from '@/types/problem';
import { ProblemCard } from '@/components/problems/ProblemCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import problemService from '@/services/problemService';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import {
  Search,
  Plus,
  ArrowLeft,
  Grid,
  List,
  SortAsc,
  SortDesc,
  TrendingUp,
  Users,
  Clock,
} from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = params.category as string;
  const [searchResult, setSearchResult] = useState<ProblemSearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ProblemDifficulty | 'all'>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Validate category
  const isValidCategory =
    category && Object.values(ProblemCategory).includes(category as ProblemCategory);
  const categoryInfo = isValidCategory ? PROBLEM_CATEGORIES[category as ProblemCategory] : null;

  useEffect(() => {
    // Load search params from URL
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');
    const page = searchParams.get('page');
    const sort = searchParams.get('sort');
    const order = searchParams.get('order');

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
  }, [searchParams]);

  useEffect(() => {
    if (isValidCategory) {
      loadProblems();
    }
  }, [category, selectedDifficulty, sortBy, sortOrder, currentPage, isValidCategory]);

  const loadProblems = async (searchTerm?: string) => {
    if (!isValidCategory) return;

    setLoading(true);
    try {
      const result = await problemService.getProblemsByCategory(category as ProblemCategory, {
        page: currentPage,
        limit: 12,
        sortBy: sortBy as any,
        sortOrder,
        ...(searchTerm !== undefined && { searchTerm }),
        ...(selectedDifficulty !== 'all' && {
          difficulty: selectedDifficulty as ProblemDifficulty,
        }),
      });

      setSearchResult(result);

      // Update URL with search params
      const urlParams = new URLSearchParams();
      if (searchTerm) urlParams.set('search', searchTerm);
      if (selectedDifficulty !== 'all') urlParams.set('difficulty', selectedDifficulty);
      if (currentPage > 1) urlParams.set('page', currentPage.toString());
      if (sortBy !== 'createdAt') urlParams.set('sort', sortBy);
      if (sortOrder !== 'desc') urlParams.set('order', sortOrder);

      const newUrl = `?${urlParams.toString()}`;
      if (newUrl !== `?${searchParams.toString()}`) {
        router.replace(newUrl, { scroll: false });
      }
    } catch (error) {
      console.error('Failed to load problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadProblems(searchTerm);
  };

  if (!isValidCategory) {
    return (
      <div>
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
            <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
            <Link href="/problems">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Problems
              </Button>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/problems">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                All Problems
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full ${categoryInfo.color} flex items-center justify-center text-white text-xl`}
                >
                  {categoryInfo.icon}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{categoryInfo.name}</h1>
                  <p className="text-gray-600">{categoryInfo.description}</p>
                </div>
              </div>
            </div>

            <Link href="/problems/create">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Problem
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        {searchResult && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Problems</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {searchResult.pagination.total}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Popular</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {searchResult.problems.filter((p) => p.statistics.totalAttempts > 10).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Recent</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        searchResult.problems.filter(
                          (p) =>
                            new Date(p.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={`Search ${categoryInfo.name.toLowerCase()} problems...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={loading}>
              Search
            </Button>
          </form>

          {/* Filters and Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Difficulty Filter */}
              <Select
                value={selectedDifficulty}
                onValueChange={(value) => {
                  setSelectedDifficulty(value as ProblemDifficulty | 'all');
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  {Object.entries(PROBLEM_DIFFICULTIES).map(([key, difficulty]) => (
                    <SelectItem key={key} value={key}>
                      <Badge
                        variant="outline"
                        className={`${difficulty.color} border-current text-xs`}
                      >
                        {difficulty.name}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <Select
                  value={sortBy}
                  onValueChange={(value) => {
                    setSortBy(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-40">
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
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? (
                    <SortAsc className="w-4 h-4" />
                  ) : (
                    <SortDesc className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {searchResult && (
                <p className="text-gray-600 text-sm">
                  {searchResult.pagination.total} problems found
                </p>
              )}
            </div>

            {/* View Mode Toggle */}
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
              <div
                className={`w-16 h-16 rounded-full ${categoryInfo.color} flex items-center justify-center text-white text-3xl mx-auto mb-4`}
              >
                {categoryInfo.icon}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No {categoryInfo.name} Problems Found
              </h2>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedDifficulty !== 'all'
                  ? 'No problems match your current filters.'
                  : `Be the first to create a ${categoryInfo.name.toLowerCase()} problem!`}
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              {(searchTerm || selectedDifficulty !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedDifficulty('all');
                    setCurrentPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              )}
              <Link href="/problems/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Problem
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
                    if (searchResult) {
                      const updatedProblems = searchResult.problems.map((p) =>
                        p.id === problemId ? { ...p, isFavorited } : p
                      );
                      setSearchResult({ ...searchResult, problems: updatedProblems });
                    }
                  }}
                  onBookmarkToggle={(problemId, isBookmarked) => {
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
