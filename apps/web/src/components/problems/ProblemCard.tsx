'use client';

import { Problem, PROBLEM_CATEGORY_INFO, PROBLEM_DIFFICULTY_INFO } from '@/types/problem';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MathText } from '@/components/ui/math-renderer';
import Link from 'next/link';
import {
  Heart,
  Bookmark,
  Star,
  Users,
  Clock,
  TrendingUp,
  Eye,
  Play,
  ChevronRight,
  Target,
} from 'lucide-react';
import { useState } from 'react';

interface ProblemCardProps {
  problem: Problem;
  showAuthor?: boolean;
  showStats?: boolean;
  showActions?: boolean;
  compact?: boolean;
  onFavoriteToggle?: (problemId: string, isFavorited: boolean) => void;
  onBookmarkToggle?: (problemId: string, isBookmarked: boolean) => void;
}

export function ProblemCard({
  problem,
  showAuthor = true,
  showStats = true,
  showActions = true,
  compact = false,
  onFavoriteToggle,
  onBookmarkToggle,
}: ProblemCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  const categoryInfo = PROBLEM_CATEGORY_INFO[problem.category];
  const difficultyInfo = PROBLEM_DIFFICULTY_INFO[problem.difficulty];

  const difficultyBadgeStyles = {
    LOW: 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/30',
    MEDIUM: 'bg-amber-500/15 text-amber-200 border border-amber-500/30',
    HIGH: 'bg-rose-500/15 text-rose-200 border border-rose-500/30',
  } as const;

  const categoryBadgeStyles: Record<string, string> = {
    Algebra: 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/30',
    Calculus: 'bg-indigo-500/15 text-indigo-200 border border-indigo-500/30',
    Geometry: 'bg-purple-500/15 text-purple-200 border border-purple-500/30',
    Trigonometry: 'bg-pink-500/15 text-pink-200 border border-pink-500/30',
    Statistics: 'bg-yellow-500/15 text-yellow-200 border border-yellow-500/30',
    'Number Theory': 'bg-slate-500/15 text-slate-200 border border-slate-500/30',
    'Linear Algebra': 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30',
    'Differential Equations': 'bg-orange-500/15 text-orange-200 border border-orange-500/30',
    Combinatorics: 'bg-lime-500/15 text-lime-200 border border-lime-500/30',
    Logic: 'bg-teal-500/15 text-teal-200 border border-teal-500/30',
  };

  const categoryAccentStyles: Record<string, string> = {
    Algebra: 'bg-emerald-400',
    Calculus: 'bg-indigo-400',
    Geometry: 'bg-purple-400',
    Trigonometry: 'bg-pink-400',
    Statistics: 'bg-yellow-400',
    'Number Theory': 'bg-slate-400',
    'Linear Algebra': 'bg-cyan-400',
    'Differential Equations': 'bg-orange-400',
    Combinatorics: 'bg-lime-400',
    Logic: 'bg-teal-400',
  };

  const categoryBadgeClass =
    categoryBadgeStyles[problem.category] || 'bg-slate-500/20 text-slate-200 border border-slate-500/30';
  const categoryAccentClass = categoryAccentStyles[problem.category] || 'bg-slate-500';
  const difficultyBadgeClass =
    difficultyBadgeStyles[problem.difficulty] || difficultyBadgeStyles.MEDIUM;

  // Enhanced difficulty color schemes for professional appearance
  const difficultyColorScheme = {
    LOW: {
      cardGradient: 'from-emerald-50/80 via-green-50/60 to-teal-50/40',
      hoverGradient:
        'group-hover:from-emerald-100/90 group-hover:via-green-100/70 group-hover:to-teal-100/50',
      borderColor: 'border-emerald-200',
      headerGradient: 'from-emerald-500 via-green-500 to-teal-500',
      textAccent: 'text-emerald-700',
      shadowColor: 'hover:shadow-emerald-500/20',
      glowColor: 'shadow-emerald-500/10',
    },
    MEDIUM: {
      cardGradient: 'from-amber-50/80 via-yellow-50/60 to-orange-50/40',
      hoverGradient:
        'group-hover:from-amber-100/90 group-hover:via-yellow-100/70 group-hover:to-orange-100/50',
      borderColor: 'border-amber-200',
      headerGradient: 'from-amber-500 via-yellow-500 to-orange-500',
      textAccent: 'text-amber-700',
      shadowColor: 'hover:shadow-amber-500/20',
      glowColor: 'shadow-amber-500/10',
    },
    HIGH: {
      cardGradient: 'from-red-50/80 via-rose-50/60 to-pink-50/40',
      hoverGradient:
        'group-hover:from-red-100/90 group-hover:via-rose-100/70 group-hover:to-pink-100/50',
      borderColor: 'border-red-200',
      headerGradient: 'from-red-500 via-rose-500 to-pink-500',
      textAccent: 'text-red-700',
      shadowColor: 'hover:shadow-red-500/20',
      glowColor: 'shadow-red-500/10',
    },
  };

  const currentScheme =
    difficultyColorScheme[problem.difficulty] || difficultyColorScheme['MEDIUM'];

  const problemTags = Array.isArray(problem.tags) ? problem.tags : [];
  const formattedAttempts =
    typeof problem.attemptCount === 'number' ? problem.attemptCount.toLocaleString() : '—';
  const formattedViews =
    typeof problem.viewCount === 'number' ? problem.viewCount.toLocaleString() : '—';
  const updatedDate = problem.updatedAt
    ? new Date(problem.updatedAt).toLocaleDateString()
    : '—';

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    // Toggle favorite state locally for now (until API is implemented)
    setIsFavorited(!isFavorited);
    onFavoriteToggle?.(problem.id, !isFavorited);

    // TODO: Implement API call when toggleFavorite method is available
    // setLoading(true);
    // try {
    //   const result = await problemService.toggleFavorite(problem.id);
    //   setIsFavorited(result.isFavorited);
    //   onFavoriteToggle?.(problem.id, result.isFavorited);
    // } catch (error) {
    //   console.error('Failed to toggle favorite:', error);
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    // Toggle bookmark state locally for now (until API is implemented)
    setIsBookmarked(!isBookmarked);
    onBookmarkToggle?.(problem.id, !isBookmarked);

    // TODO: Implement API call when toggleBookmark method is available
    // setLoading(true);
    // try {
    //   const result = await problemService.toggleBookmark(problem.id);
    //   setIsBookmarked(result.isBookmarked);
    //   onBookmarkToggle?.(problem.id, result.isBookmarked);
    // } catch (error) {
    //   console.error('Failed to toggle bookmark:', error);
    // } finally {
    //   setLoading(false);
    // }
  };

  const truncateDescription = (text: string | undefined | null, maxLength: number) => {
    if (!text) {
      return 'No short description provided yet.';
    }
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const qualityPercent =
    typeof problem.qualityScore === 'number' ? Math.round(problem.qualityScore) : null;

  if (compact) {
    return (
      <Link href={`/problems/${problem.id}`} className="block group">
        <div
          className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3
          text-sm text-slate-300 transition-all duration-200 hover:border-slate-700 hover:bg-slate-950 hover:shadow-lg"
        >
          <div className={`h-12 w-1 rounded-full ${categoryAccentClass}`} />
          <div className="flex flex-1 flex-wrap items-center gap-4 min-w-0">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${categoryBadgeClass}`}
                >
                  {categoryInfo?.name || problem.category}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${difficultyBadgeClass}`}
                >
                  {difficultyInfo?.name || problem.difficulty}
                </span>
              </div>
              <h3 className="font-semibold text-base text-slate-50 truncate">{problem.title}</h3>
              {problemTags.length > 0 && (
                <div className="hidden sm:flex flex-wrap gap-1 text-[11px] text-slate-500 mt-1">
                  {problemTags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-900/60 border border-slate-800 px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                  {problemTags.length > 2 && (
                    <span className="rounded-full bg-slate-900/60 border border-slate-800 px-2 py-0.5">
                      +{problemTags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-5 text-xs sm:text-sm font-medium text-slate-400 shrink-0">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {qualityPercent ? `${qualityPercent}% score` : 'Score —'}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {formattedAttempts}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {formattedViews}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition ml-auto" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="group relative h-full">
      <Card
        className={`
        h-full overflow-hidden transition-all duration-500 ease-out cursor-pointer 
        border-2 ${currentScheme.borderColor} shadow-sm hover:shadow-2xl ${currentScheme.shadowColor} hover:-translate-y-2
        bg-gradient-to-br from-white via-white to-white ${currentScheme.cardGradient} ${currentScheme.hoverGradient}
        hover:scale-[1.02] transform-gpu will-change-transform
        relative ring-1 ring-gray-200/50 hover:ring-2 hover:ring-current/20
        ${compact ? 'p-2' : 'p-0'}
      `}
      >
        {/* Difficulty-Themed Header Band */}
        <div
          className={`
          h-2 bg-gradient-to-r transition-all duration-500 ease-out
          ${currentScheme.headerGradient} group-hover:h-4 group-hover:shadow-lg ${currentScheme.glowColor}
          relative overflow-hidden
        `}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <Link href={`/problems/${problem.id}`} className="block h-full">
          <div className={`p-3 sm:p-4 lg:p-5 h-full flex flex-col ${compact ? 'p-2 sm:p-3' : ''}`}>
            {/* Header Section */}
            <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="flex-1 min-w-0">
                {/* Category and Difficulty */}
                <div className="flex items-center gap-2 flex-wrap mb-2 sm:mb-3">
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${categoryBadgeClass}`}
                  >
                    {categoryInfo?.name || problem.category}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${difficultyBadgeClass}`}
                  >
                    {difficultyInfo?.name || problem.difficulty}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className={`
                  font-bold text-gray-900 leading-tight mb-2
                  group-hover:${currentScheme.textAccent} transition-all duration-300
                  group-hover:translate-x-1 group-hover:drop-shadow-sm
                  ${compact ? 'text-sm sm:text-base line-clamp-2' : 'text-base sm:text-lg lg:text-xl line-clamp-2'}
                `}
                >
                  {problem.title}
                </h3>

                {/* Rating */}
                {problem.avgRating && (
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= Math.round(problem.avgRating!)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 font-medium">
                      {problem.avgRating.toFixed(1)} ({problem._count?.ratings || 0})
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {showActions && (
                <div className="flex items-center gap-0.5 sm:gap-1 opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors touch-manipulation"
                    onClick={handleFavoriteToggle}
                    disabled={loading}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-200 ${
                        isFavorited
                          ? 'fill-red-500 text-red-500 scale-110'
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors touch-manipulation"
                    onClick={handleBookmarkToggle}
                    disabled={loading}
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-200 ${
                        isBookmarked
                          ? 'fill-blue-500 text-blue-500 scale-110'
                          : 'text-gray-400 hover:text-blue-500'
                      }`}
                    />
                  </Button>
                </div>
              )}
            </div>

            {/* Description */}
            <div
              className={`text-gray-600 leading-relaxed mb-3 sm:mb-4 flex-1 ${
                compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
              }`}
            >
              <MathText className="line-clamp-3 text-justify sm:text-left">
                {truncateDescription(
                  problem.description || problem.prompt,
                  compact ? 100 : 160
                )}
              </MathText>
            </div>

            {/* Tags */}
            {problem.tags && Array.isArray(problem.tags) && problem.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4">
                {problem.tags.slice(0, compact ? 2 : 3).map((tag, index) => (
                  <Badge
                    key={`${tag}-${index}`}
                    variant="secondary"
                    className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium border-0 rounded-full"
                  >
                    {tag}
                  </Badge>
                ))}
                {problem.tags.length > (compact ? 2 : 3) && (
                  <Badge
                    variant="secondary"
                    className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-700 font-medium border-0 rounded-full"
                  >
                    +{problem.tags.length - (compact ? 2 : 3)}
                  </Badge>
                )}
              </div>
            )}

            {/* Footer Section */}
            <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100/70">
              {/* Stats */}
              <div className="flex items-center gap-2 sm:gap-4">
                {showStats && (
                  <>
                    <div className="flex items-center gap-1 sm:gap-1.5 text-gray-500">
                      <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium">
                        {qualityPercent ? `${qualityPercent}%` : 'Score —'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5 text-gray-500">
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium">
                        {formattedViews}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5 text-gray-500">
                      <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium">
                        {formattedAttempts}
                      </span>
                    </div>
                  </>
                )}

                {/* Author */}
                {showAuthor && problem.creator && (
                  <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600">
                    <Avatar className="w-5 h-5 sm:w-6 sm:h-6 border border-gray-200">
                      <AvatarImage src={problem.creator.profileImage} />
                      <AvatarFallback className="text-xs font-medium bg-gray-100">
                        {problem.creator.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs sm:text-sm font-medium hidden sm:block truncate max-w-20">
                      {problem.creator.username}
                    </span>
                  </div>
                )}
              </div>

              {/* Date and Action */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-0.5 sm:gap-1 text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs hidden xs:inline">Updated {updatedDate}</span>
                </div>

                {/* Solve Button */}
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 sm:translate-x-2 group-hover:translate-x-0">
                  <div
                    className={`
                    flex items-center gap-0.5 sm:gap-1 font-semibold text-xs sm:text-sm
                    ${currentScheme.textAccent} group-hover:scale-105 transition-all duration-200
                    px-2 py-1 rounded-full bg-white/60 backdrop-blur-sm border border-current/20
                    hover:bg-current/10 hover:shadow-sm
                  `}
                  >
                    <Play className="w-3 h-3" />
                    <span className="hidden sm:inline">Solve</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Difficulty-Themed Hover Overlay */}
        <div
          className={`
          absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
          bg-gradient-to-br ${currentScheme.cardGradient.replace('from-', 'from-').replace('via-', 'via-').replace('to-', 'to-')}
        `}
        />

        {/* Enhanced Difficulty Indicator */}
        <div
          className={`
          absolute top-3 right-3 w-3 h-3 rounded-full transition-all duration-300
          opacity-70 group-hover:opacity-100 group-hover:w-4 group-hover:h-4
          shadow-lg ${currentScheme.glowColor}
          ${
            difficultyInfo?.level === 1
              ? 'bg-gradient-to-br from-emerald-400 to-green-500'
              : difficultyInfo?.level === 2
                ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                : 'bg-gradient-to-br from-red-400 to-rose-500'
          }
        `}
        >
          <div className="absolute inset-0 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Card>
    </div>
  );
}

export default ProblemCard;
