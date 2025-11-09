import { API_BASE_URL } from '@/lib/config';
import ProblemsClient from '@/components/problems/ProblemsClient';
import { ProblemSearchResult, ProblemCategory, ProblemDifficulty } from '@/types/problem';

const PAGE_SIZE = 24;
const EMPTY_RESULT: ProblemSearchResult = {
  problems: [],
  pagination: {
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
};

export const dynamic = 'force-dynamic';

type QueryState = {
  searchTerm: string;
  category: ProblemCategory | 'all';
  difficulty: ProblemDifficulty | 'all';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
};

const parseParam = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
};

const parseNumberParam = (value: string | string[] | undefined, fallback: number) => {
  const parsed = parseInt(parseParam(value), 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const parseSortOrder = (value: string | string[] | undefined): 'asc' | 'desc' => {
  const normalized = parseParam(value).toLowerCase();
  return normalized === 'asc' ? 'asc' : 'desc';
};

async function fetchInitialData(query: QueryState): Promise<ProblemSearchResult> {
  try {
    const endpoint = query.searchTerm ? '/problems/search' : '/problems';
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    url.searchParams.set('page', query.page.toString());
    url.searchParams.set('limit', PAGE_SIZE.toString());
    url.searchParams.set('sortBy', query.sortBy);
    url.searchParams.set('sortOrder', query.sortOrder);

    if (query.searchTerm) url.searchParams.set('q', query.searchTerm);
    if (query.category !== 'all') url.searchParams.set('category', query.category);
    if (query.difficulty !== 'all') url.searchParams.set('difficulty', query.difficulty);

    const response = await fetch(url.toString(), {
      cache: 'no-store',
    });

    if (!response.ok) {
      return EMPTY_RESULT;
    }

    const json = await response.json();
    return json?.data ?? EMPTY_RESULT;
  } catch (error) {
    console.error('Failed to fetch initial problems', error);
    return EMPTY_RESULT;
  }
}

export default async function ProblemsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const searchTerm = parseParam(searchParams.search);
  const category = (parseParam(searchParams.category) as ProblemCategory) || 'all';
  const difficulty = (parseParam(searchParams.difficulty) as ProblemDifficulty) || 'all';
  const page = Math.max(1, parseNumberParam(searchParams.page, 1));
  const sortBy = parseParam(searchParams.sort) || 'createdAt';
  const sortOrder = parseSortOrder(searchParams.order);

  const initialQuery: QueryState = {
    searchTerm,
    category: category || 'all',
    difficulty: difficulty || 'all',
    sortBy,
    sortOrder,
    page,
  };

  const initialData = await fetchInitialData(initialQuery);

  return <ProblemsClient initialData={initialData} initialQuery={initialQuery} />;
}
