'use client';

import { useState, useEffect, useCallback } from 'react';
import { userService, UserSearchResult, UserPublicProfile } from '@/services/userService';
import { UserCard } from '@/components/user/UserCard';
import { UserSearchFilters } from '@/components/user/UserSearchFilters';
import Header from '@/components/layout/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Users, ChevronLeft, ChevronRight } from 'lucide-react';

export default function UsersPage() {
  const [searchResult, setSearchResult] = useState<UserSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useState<{
    searchTerm: string;
    page: number;
    limit: number;
    sortBy: 'username' | 'rankPoints' | 'createdAt';
    sortOrder: 'asc' | 'desc';
  }>({
    searchTerm: '',
    page: 1,
    limit: 20,
    sortBy: 'username',
    sortOrder: 'asc',
  });

  const [searchInput, setSearchInput] = useState('');

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await userService.searchUsers({
        ...searchParams,
        searchTerm: searchParams.searchTerm || undefined,
      });
      setSearchResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search users');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams((prev) => ({
      ...prev,
      searchTerm: searchInput,
      page: 1,
    }));
  };

  const handleSortChange = (
    sortBy: 'username' | 'rankPoints' | 'createdAt',
    sortOrder: 'asc' | 'desc'
  ) => {
    setSearchParams((prev) => ({
      ...prev,
      sortBy,
      sortOrder,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Users</h1>
          <p className="text-gray-600">Find and connect with other math enthusiasts</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search users by username or email..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={loading}>
                Search
              </Button>
            </div>

            {/* Search Filters */}
            <UserSearchFilters
              sortBy={searchParams.sortBy}
              sortOrder={searchParams.sortOrder}
              onSortChange={handleSortChange}
            />
          </form>
        </div>

        {/* Results */}
        {error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error}</div>
            <Button onClick={handleSearch}>Try Again</Button>
          </div>
        ) : loading ? (
          <div className="space-y-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : searchResult ? (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-gray-600">
                <Users className="w-5 h-5" />
                <span>
                  {searchResult?.pagination?.total} user
                  {searchResult?.pagination?.total !== 1 ? 's' : ''} found
                  {searchParams?.searchTerm && (
                    <span> for &quot;{searchParams.searchTerm}&quot;</span>
                  )}
                </span>
              </div>
            </div>

            {/* User Cards */}
            {searchResult?.users?.length > 0 ? (
              <div className="grid gap-6">
                {searchResult.users.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-600 mb-4">
                  {searchParams.searchTerm
                    ? `No users match your search for "${searchParams.searchTerm}"`
                    : 'Try adjusting your search criteria'}
                </p>
                {searchParams.searchTerm && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchInput('');
                      setSearchParams((prev) => ({ ...prev, searchTerm: '', page: 1 }));
                    }}
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            )}

            {/* Pagination */}
            {searchResult?.pagination?.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-4 pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(searchParams.page - 1)}
                  disabled={searchParams.page <= 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <span className="text-sm text-gray-600">
                  Page {searchParams.page} of {searchResult.pagination.totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(searchParams.page + 1)}
                  disabled={searchParams.page >= searchResult.pagination.totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
