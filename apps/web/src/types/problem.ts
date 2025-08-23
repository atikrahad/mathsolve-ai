export interface Problem {
  id: string;
  title: string;
  description: string;
  content: string; // Mathematical problem content with LaTeX/MathML
  category: ProblemCategory;
  difficulty: ProblemDifficulty;
  tags: string[];
  author: {
    id: string;
    username: string;
    profileImage?: string;
  };
  solution?: ProblemSolution;
  hints: ProblemHint[];
  rating: {
    average: number;
    count: number;
    userRating?: number;
  };
  statistics: {
    totalAttempts: number;
    successfulAttempts: number;
    successRate: number;
  };
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  isFavorited?: boolean;
  isBookmarked?: boolean;
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

export enum ProblemCategory {
  ARITHMETIC = 'arithmetic',
  ALGEBRA = 'algebra',
  GEOMETRY = 'geometry',
  TRIGONOMETRY = 'trigonometry',
  CALCULUS = 'calculus',
  STATISTICS = 'statistics',
  PROBABILITY = 'probability',
  DISCRETE_MATH = 'discrete_math',
  LINEAR_ALGEBRA = 'linear_algebra',
  DIFFERENTIAL_EQUATIONS = 'differential_equations',
  NUMBER_THEORY = 'number_theory',
  COMBINATORICS = 'combinatorics',
}

export enum ProblemDifficulty {
  BEGINNER = 'beginner',
  ELEMENTARY = 'elementary',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

export interface ProblemSearchParams {
  searchTerm?: string;
  category?: ProblemCategory;
  difficulty?: ProblemDifficulty;
  tags?: string[];
  authorId?: string;
  sortBy?: 'title' | 'difficulty' | 'rating' | 'createdAt' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  includeUnpublished?: boolean;
}

export interface ProblemSearchResult {
  problems: Problem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  facets: {
    categories: { [key in ProblemCategory]?: number };
    difficulties: { [key in ProblemDifficulty]?: number };
    popularTags: Array<{ tag: string; count: number }>;
  };
}

export interface CreateProblemData {
  title: string;
  description: string;
  content: string;
  category: ProblemCategory;
  difficulty: ProblemDifficulty;
  tags: string[];
  solution?: string;
  hints?: string[];
  isPublished: boolean;
}

export interface UpdateProblemData {
  title?: string;
  description?: string;
  content?: string;
  category?: ProblemCategory;
  difficulty?: ProblemDifficulty;
  tags?: string[];
  solution?: string;
  hints?: string[];
  isPublished?: boolean;
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
export const PROBLEM_CATEGORIES = {
  [ProblemCategory.ARITHMETIC]: {
    name: 'Arithmetic',
    description: 'Basic math operations, fractions, decimals',
    icon: '🔢',
    color: 'bg-blue-500',
  },
  [ProblemCategory.ALGEBRA]: {
    name: 'Algebra',
    description: 'Equations, polynomials, functions',
    icon: '📈',
    color: 'bg-green-500',
  },
  [ProblemCategory.GEOMETRY]: {
    name: 'Geometry',
    description: 'Shapes, angles, area, volume',
    icon: '📐',
    color: 'bg-purple-500',
  },
  [ProblemCategory.TRIGONOMETRY]: {
    name: 'Trigonometry',
    description: 'Sin, cos, tan, and triangle relationships',
    icon: '📊',
    color: 'bg-red-500',
  },
  [ProblemCategory.CALCULUS]: {
    name: 'Calculus',
    description: 'Derivatives, integrals, limits',
    icon: '∫',
    color: 'bg-indigo-500',
  },
  [ProblemCategory.STATISTICS]: {
    name: 'Statistics',
    description: 'Data analysis, distributions, hypothesis testing',
    icon: '📊',
    color: 'bg-yellow-500',
  },
  [ProblemCategory.PROBABILITY]: {
    name: 'Probability',
    description: 'Random events, combinations, permutations',
    icon: '🎲',
    color: 'bg-pink-500',
  },
  [ProblemCategory.DISCRETE_MATH]: {
    name: 'Discrete Math',
    description: 'Logic, sets, graphs, algorithms',
    icon: '🔗',
    color: 'bg-teal-500',
  },
  [ProblemCategory.LINEAR_ALGEBRA]: {
    name: 'Linear Algebra',
    description: 'Matrices, vectors, eigenvalues',
    icon: '⬜',
    color: 'bg-cyan-500',
  },
  [ProblemCategory.DIFFERENTIAL_EQUATIONS]: {
    name: 'Differential Equations',
    description: 'ODEs, PDEs, systems of equations',
    icon: '🌊',
    color: 'bg-orange-500',
  },
  [ProblemCategory.NUMBER_THEORY]: {
    name: 'Number Theory',
    description: 'Prime numbers, modular arithmetic, cryptography',
    icon: '🔐',
    color: 'bg-gray-600',
  },
  [ProblemCategory.COMBINATORICS]: {
    name: 'Combinatorics',
    description: 'Counting, arrangements, graph theory',
    icon: '🧮',
    color: 'bg-emerald-500',
  },
} as const;

// Difficulty display information
export const PROBLEM_DIFFICULTIES = {
  [ProblemDifficulty.BEGINNER]: {
    name: 'Beginner',
    description: 'Basic concepts and simple problems',
    color: 'bg-green-100 text-green-800',
    level: 1,
  },
  [ProblemDifficulty.ELEMENTARY]: {
    name: 'Elementary',
    description: 'Elementary to middle school level',
    color: 'bg-blue-100 text-blue-800',
    level: 2,
  },
  [ProblemDifficulty.INTERMEDIATE]: {
    name: 'Intermediate',
    description: 'High school to early college level',
    color: 'bg-yellow-100 text-yellow-800',
    level: 3,
  },
  [ProblemDifficulty.ADVANCED]: {
    name: 'Advanced',
    description: 'College level and beyond',
    color: 'bg-orange-100 text-orange-800',
    level: 4,
  },
  [ProblemDifficulty.EXPERT]: {
    name: 'Expert',
    description: 'Graduate level and research problems',
    color: 'bg-red-100 text-red-800',
    level: 5,
  },
} as const;