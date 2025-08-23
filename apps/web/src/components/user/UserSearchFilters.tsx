'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowUpDown, SortAsc, SortDesc } from 'lucide-react';

interface UserSearchFiltersProps {
  sortBy: 'username' | 'rankPoints' | 'createdAt';
  sortOrder: 'asc' | 'desc';
  onSortChange: (
    sortBy: 'username' | 'rankPoints' | 'createdAt',
    sortOrder: 'asc' | 'desc'
  ) => void;
}

export function UserSearchFilters({ sortBy, sortOrder, onSortChange }: UserSearchFiltersProps) {
  const handleSortByChange = (newSortBy: 'username' | 'rankPoints' | 'createdAt') => {
    onSortChange(newSortBy, sortOrder);
  };

  const handleSortOrderToggle = () => {
    onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getSortLabel = (field: string) => {
    switch (field) {
      case 'username':
        return 'Username';
      case 'rankPoints':
        return 'Rank Points';
      case 'createdAt':
        return 'Join Date';
      default:
        return field;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Sort by:</span>
        <Select value={sortBy} onValueChange={handleSortByChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="username">Username</SelectItem>
            <SelectItem value="rankPoints">Rank Points</SelectItem>
            <SelectItem value="createdAt">Join Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleSortOrderToggle}
        className="flex items-center space-x-2"
      >
        {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
        <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
      </Button>

      <div className="text-sm text-gray-600 flex items-center space-x-1">
        <ArrowUpDown className="w-4 h-4" />
        <span>
          Sorted by {getSortLabel(sortBy)} ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
        </span>
      </div>
    </div>
  );
}
