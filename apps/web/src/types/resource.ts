// Resource types based on backend schema
export interface Resource {
  id: string;
  title: string;
  content: string;
  type: ResourceType;
  category: string;
  difficulty: DifficultyLevel | null;
  authorId: string;
  viewCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    profileImage: string | null;
  };
  _count: {
    bookmarks: number;
  };
  isBookmarked?: boolean;
}

export type ResourceType = 'TUTORIAL' | 'GUIDE' | 'REFERENCE';

export type DifficultyLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface CreateResourceData {
  title: string;
  content: string;
  type: ResourceType;
  category: string;
  difficulty?: DifficultyLevel | null;
}

export interface UpdateResourceData {
  title?: string;
  content?: string;
  type?: ResourceType;
  category?: string;
  difficulty?: DifficultyLevel | null;
}

export interface ResourceSearchParams {
  page?: number;
  limit?: number;
  category?: string;
  type?: ResourceType;
  difficulty?: DifficultyLevel;
  authorId?: string;
  search?: string;
  sortBy?: 'createdAt' | 'viewCount' | 'rating' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface ResourceSearchResult {
  resources: Resource[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface Bookmark {
  id: string;
  userId: string;
  resourceId?: string;
  problemId?: string;
  createdAt: string;
}

export interface ResourceStats {
  totalResources: number;
  byCategory: Array<{ category: string; count: number }>;
  byType: Array<{ type: string; count: number }>;
  byDifficulty: Array<{ difficulty: string; count: number }>;
}

// Constants for form dropdowns and validation
export const RESOURCE_TYPES: { value: ResourceType; label: string; description: string }[] = [
  {
    value: 'TUTORIAL',
    label: 'Tutorial',
    description: 'Step-by-step learning materials with examples',
  },
  {
    value: 'GUIDE',
    label: 'Guide',
    description: 'Comprehensive guides on specific topics',
  },
  {
    value: 'REFERENCE',
    label: 'Reference',
    description: 'Quick reference materials and formulas',
  },
];

export const RESOURCE_CATEGORIES = [
  'Algebra',
  'Calculus',
  'Geometry',
  'Statistics',
  'Trigonometry',
  'Number Theory',
  'Linear Algebra',
  'Differential Equations',
  'Combinatorics',
  'Logic',
  'General',
  'Other',
] as const;

export const DIFFICULTY_LEVELS: { value: DifficultyLevel; label: string; color: string }[] = [
  { value: 'LOW', label: 'Beginner', color: 'bg-green-100 text-green-800' },
  { value: 'MEDIUM', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'HIGH', label: 'Advanced', color: 'bg-red-100 text-red-800' },
];

// Utility functions
export const getResourceTypeInfo = (type: ResourceType) => {
  return RESOURCE_TYPES.find(t => t.value === type) || RESOURCE_TYPES[0];
};

export const getDifficultyInfo = (difficulty: DifficultyLevel | null) => {
  if (!difficulty) return { label: 'Not specified', color: 'bg-gray-100 text-gray-600' };
  return DIFFICULTY_LEVELS.find(d => d.value === difficulty) || DIFFICULTY_LEVELS[0];
};

export const formatResourceType = (type: ResourceType): string => {
  const typeInfo = getResourceTypeInfo(type);
  return typeInfo.label;
};

export const getResourceTypeIcon = (type: ResourceType): string => {
  switch (type) {
    case 'TUTORIAL':
      return '📚';
    case 'GUIDE':
      return '🗺️';
    case 'REFERENCE':
      return '📖';
    default:
      return '📄';
  }
};