'use client';

import { Problem, PROBLEM_CATEGORIES, PROBLEM_DIFFICULTIES } from '@/types/problem';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
  Eye 
} from 'lucide-react';
import { useState } from 'react';
import problemService from '@/services/problemService';

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
  const [isFavorited, setIsFavorited] = useState(problem.isFavorited || false);
  const [isBookmarked, setIsBookmarked] = useState(problem.isBookmarked || false);
  const [loading, setLoading] = useState(false);

  const categoryInfo = PROBLEM_CATEGORIES[problem.category];
  const difficultyInfo = PROBLEM_DIFFICULTIES[problem.difficulty];

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;
    
    setLoading(true);
    try {
      const result = await problemService.toggleFavorite(problem.id);
      setIsFavorited(result.isFavorited);
      onFavoriteToggle?.(problem.id, result.isFavorited);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;
    
    setLoading(true);
    try {
      const result = await problemService.toggleBookmark(problem.id);
      setIsBookmarked(result.isBookmarked);
      onBookmarkToggle?.(problem.id, result.isBookmarked);
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <Link href={`/problems/${problem.id}`}>
      <Card className={`hover:shadow-md transition-shadow cursor-pointer group ${
        compact ? 'p-3' : ''
      }`}>
        <CardHeader className={`${compact ? 'p-0 pb-2' : 'pb-3'}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className={`w-2 h-2 rounded-full ${categoryInfo.color}`}
                  title={categoryInfo.name}
                />
                <Badge 
                  variant="outline" 
                  className={`text-xs ${difficultyInfo.color} border-current`}
                >
                  {difficultyInfo.name}
                </Badge>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-xs text-gray-600">
                    {problem.rating.average.toFixed(1)} ({problem.rating.count})
                  </span>
                </div>
              </div>
              
              <h3 className={`font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 ${
                compact ? 'text-sm' : 'text-base'
              }`}>
                {problem.title}
              </h3>
            </div>

            {showActions && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-7 w-7"
                  onClick={handleFavoriteToggle}
                  disabled={loading}
                >
                  <Heart 
                    className={`w-4 h-4 ${
                      isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-7 w-7"
                  onClick={handleBookmarkToggle}
                  disabled={loading}
                >
                  <Bookmark 
                    className={`w-4 h-4 ${
                      isBookmarked ? 'fill-blue-500 text-blue-500' : 'text-gray-400'
                    }`}
                  />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className={`${compact ? 'p-0' : 'pt-0'}`}>
          <div className="space-y-3">
            {/* Description */}
            <div className={`text-gray-600 ${compact ? 'text-sm' : ''}`}>
              <MathText>
                {truncateDescription(problem.description, compact ? 100 : 150)}
              </MathText>
            </div>

            {/* Tags */}
            {problem.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {problem.tags.slice(0, compact ? 2 : 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {problem.tags.length > (compact ? 2 : 3) && (
                  <Badge variant="secondary" className="text-xs">
                    +{problem.tags.length - (compact ? 2 : 3)}
                  </Badge>
                )}
              </div>
            )}

            {/* Stats and Author */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-3">
                {showStats && (
                  <>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{problem.statistics.totalAttempts}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{Math.round(problem.statistics.successRate)}%</span>
                    </div>
                  </>
                )}
                
                {showAuthor && (
                  <div className="flex items-center gap-2">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={problem.author.profileImage} />
                      <AvatarFallback className="text-xs">
                        {problem.author.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{problem.author.username}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs">
                <Clock className="w-3 h-3" />
                <span>
                  {new Date(problem.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default ProblemCard;