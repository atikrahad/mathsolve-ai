// Problem categories - matching seed data
export const PROBLEM_CATEGORIES = [
  'Algebra',
  'Calculus',
  'Geometry',
  'Trigonometry',
  'Statistics',
  'Number Theory',
  'Linear Algebra',
  'Differential Equations',
  'Combinatorics',
  'Logic'
] as const;

export type ProblemCategory = typeof PROBLEM_CATEGORIES[number];

// Problem difficulties - matching seed data
export const PROBLEM_DIFFICULTY_LEVELS = [
  'LOW',
  'MEDIUM',
  'HIGH'
] as const;

export type ProblemDifficulty = typeof PROBLEM_DIFFICULTY_LEVELS[number];

// Backward compatibility alias
export const PROBLEM_DIFFICULTIES = PROBLEM_DIFFICULTY_LEVELS;

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: ProblemDifficulty;
  category: ProblemCategory;
  tags: string[];
  solution?: string;
  qualityScore: number;
  viewCount: number;
  attemptCount: number;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    username: string;
    profileImage?: string;
  };
  _count?: {
    ratings: number;
    solutions: number;
    comments: number;
  };
  avgRating?: number;
  parsedTags?: string[];
  userRating?: number | null;
}

export interface ProblemSolution {
  id: string;
  content: string; // Solution steps with LaTeX/MathML
  explanation: string;
  isOfficial: boolean;
  author: {
    id: string;
    username: string;
    profileImage?: string;
  };
  verificationStatus: 'verified' | 'pending' | 'rejected';
  createdAt: string;
}

export interface ProblemHint {
  id: string;
  content: string;
  order: number;
  isUnlocked?: boolean;
}

export interface ProblemSearchParams {
  q?: string; // search query
  page?: number;
  limit?: number;
  category?: string;
  difficulty?: ProblemDifficulty;
  search?: string;
  tags?: string[];
  sortBy?: 'createdAt' | 'qualityScore' | 'viewCount' | 'attemptCount' | 'title';
  sortOrder?: 'asc' | 'desc';
  creatorId?: string;
}

export interface ProblemSearchResult {
  problems: Problem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CreateProblemData {
  title: string;
  description: string;
  difficulty: ProblemDifficulty;
  category: string;
  tags: string[];
  solution?: string;
}

export interface UpdateProblemData {
  title?: string;
  description?: string;
  difficulty?: ProblemDifficulty;
  category?: string;
  tags?: string[];
  solution?: string;
}

export interface ProblemAttempt {
  id: string;
  problemId: string;
  userId: string;
  answer: string;
  isCorrect: boolean;
  hintsUsed: number;
  timeSpent: number; // in seconds
  createdAt: string;
}

export interface ProblemRating {
  problemId: string;
  rating: number; // 1-5 stars
  comment?: string;
}

// Category display information
export const PROBLEM_CATEGORY_INFO = {
  'Algebra': {
    name: 'Algebra',
    description: 'Equations, polynomials, functions',
    icon: '📈',
    color: 'bg-green-500',
  },
  'Calculus': {
    name: 'Calculus',
    description: 'Derivatives, integrals, limits',
    icon: '∫',
    color: 'bg-indigo-500',
  },
  'Geometry': {
    name: 'Geometry',
    description: 'Shapes, angles, area, volume',
    icon: '📐',
    color: 'bg-purple-500',
  },
  'Trigonometry': {
    name: 'Trigonometry',
    description: 'Sin, cos, tan, and triangle relationships',
    icon: '📊',
    color: 'bg-red-500',
  },
  'Statistics': {
    name: 'Statistics',
    description: 'Data analysis, distributions, hypothesis testing',
    icon: '📊',
    color: 'bg-yellow-500',
  },
  'Number Theory': {
    name: 'Number Theory',
    description: 'Prime numbers, modular arithmetic, cryptography',
    icon: '🔐',
    color: 'bg-gray-600',
  },
  'Linear Algebra': {
    name: 'Linear Algebra',
    description: 'Matrices, vectors, eigenvalues',
    icon: '⬜',
    color: 'bg-cyan-500',
  },
  'Differential Equations': {
    name: 'Differential Equations',
    description: 'ODEs, PDEs, systems of equations',
    icon: '🌊',
    color: 'bg-orange-500',
  },
  'Combinatorics': {
    name: 'Combinatorics',
    description: 'Counting, arrangements, graph theory',
    icon: '🧮',
    color: 'bg-emerald-500',
  },
  'Logic': {
    name: 'Logic',
    description: 'Truth tables, proofs, logical reasoning',
    icon: '🧠',
    color: 'bg-teal-500',
  },
} as const;

// Difficulty display information
export const PROBLEM_DIFFICULTY_INFO = {
  'LOW': {
    name: 'Low',
    description: 'Basic concepts and simple problems',
    color: 'bg-green-100 text-green-800',
    level: 1,
  },
  'MEDIUM': {
    name: 'Medium',
    description: 'Intermediate level problems',
    color: 'bg-yellow-100 text-yellow-800',
    level: 2,
  },
  'HIGH': {
    name: 'High',
    description: 'Advanced and challenging problems',
    color: 'bg-red-100 text-red-800',
    level: 3,
  },
} as const;