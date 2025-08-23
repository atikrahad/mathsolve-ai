'use client';

// @ts-nocheck - Temporary fix for React component type compatibility issues
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Problem, ProblemAttempt, PROBLEM_CATEGORIES, PROBLEM_DIFFICULTIES } from '@/types/problem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MathRenderer, MathText } from '@/components/ui/math-renderer';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import problemService from '@/services/problemService';
import { ProblemRatingComponent } from '@/components/problems/ProblemRatingComponent';
import Header from '@/components/layout/Header';
import Link from 'next/link';
import {
  Heart,
  Bookmark,
  Share2,
  Flag,
  Clock,
  Target,
  TrendingUp,
  Users,
  Star,
  Lightbulb,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Edit
} from 'lucide-react';

interface ProblemSolutionAttempt {
  answer: string;
  feedback?: string;
}

export default function ProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.id as string;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [attempts, setAttempts] = useState<ProblemAttempt[]>([]);
  const [lastAttempt, setLastAttempt] = useState<ProblemSolutionAttempt | null>(null);
  const [hintsUnlocked, setHintsUnlocked] = useState(0);
  const [similarProblems, setSimilarProblems] = useState<Problem[]>([]);
  const [showHintUnlock, setShowHintUnlock] = useState(false);

  useEffect(() => {
    if (problemId) {
      loadProblemDetails();
    }
  }, [problemId]);

  const loadProblemDetails = async () => {
    setLoading(true);
    try {
      const [problemData, attemptsData, hintsData, similarData] = await Promise.all([
        problemService.getProblemById(problemId),
        problemService.getUserAttempts(problemId).catch(() => ({ attempts: [] })),
        problemService.getProblemHints(problemId).catch(() => ({ hints: [], unlockedCount: 0 })),
        problemService.getSimilarProblems(problemId).catch(() => [])
      ]);

      setProblem(problemData);
      setAttempts(attemptsData.attempts || []);
      setHintsUnlocked(hintsData.unlockedCount);
      setSimilarProblems(similarData);
    } catch (error) {
      console.error('Failed to load problem details:', error);
      router.push('/problems');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || submitting) return;

    setSubmitting(true);
    try {
      const result = await problemService.submitAttempt(
        problemId,
        userAnswer.trim(),
        hintsUnlocked
      );
      
      setLastAttempt({
        answer: userAnswer,
        feedback: result.feedback
      });
      
      setAttempts([result.attempt, ...attempts]);
      
      if (result.isCorrect) {
        // Problem solved successfully
        setUserAnswer('');
      }
      
      // Refresh problem data to update statistics
      const updatedProblem = await problemService.getProblemById(problemId);
      setProblem(updatedProblem);
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnlockHint = async () => {
    try {
      setShowHintUnlock(true);
      await problemService.unlockHint(problemId);
      setHintsUnlocked(prev => prev + 1);
      
      // Refresh problem hints
      const hintsData = await problemService.getProblemHints(problemId);
      setHintsUnlocked(hintsData.unlockedCount);
    } catch (error) {
      console.error('Failed to unlock hint:', error);
    } finally {
      setShowHintUnlock(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!problem) return;
    try {
      const result = await problemService.toggleFavorite(problemId);
      setProblem({ ...problem, isFavorited: result.isFavorited });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleToggleBookmark = async () => {
    if (!problem) return;
    try {
      const result = await problemService.toggleBookmark(problemId);
      setProblem({ ...problem, isBookmarked: result.isBookmarked });
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: problem?.title,
        text: problem?.description,
        url: window.location.href
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Problem Not Found</h1>
          <p className="text-gray-600 mb-6">The problem you're looking for doesn't exist or has been removed.</p>
          <Link href="/problems">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Problems
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const categoryInfo = PROBLEM_CATEGORIES[problem.category];
  const difficultyInfo = PROBLEM_DIFFICULTIES[problem.difficulty];
  const isCorrectlySolved = attempts.some(attempt => attempt.isCorrect);
  const visibleHints = problem.hints.slice(0, hintsUnlocked);
  const hasMoreHints = problem.hints.length > hintsUnlocked;

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/problems">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${categoryInfo.color}`} />
          <Badge variant="outline" className={`${difficultyInfo.color} border-current`}>
            {difficultyInfo.name}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Problem Details */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-3">{problem.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={problem.author.profileImage} />
                        <AvatarFallback className="text-xs">
                          {problem.author.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Link 
                        href={`/users/${problem.author.id}`}
                        className="hover:text-blue-600"
                      >
                        {problem.author.username}
                      </Link>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(problem.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{problem.rating.average.toFixed(1)} ({problem.rating.count})</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleFavorite}
                    className="p-2"
                  >
                    <Heart 
                      className={`w-5 h-5 ${
                        problem.isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'
                      }`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleBookmark}
                    className="p-2"
                  >
                    <Bookmark 
                      className={`w-5 h-5 ${
                        problem.isBookmarked ? 'fill-blue-500 text-blue-500' : 'text-gray-400'
                      }`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="p-2"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 text-red-600"
                  >
                    <Flag className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Problem Description */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Description</h3>
                <div className="prose max-w-none">
                  <MathText>{problem.description}</MathText>
                </div>
              </div>

              {/* Problem Content */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Problem</h3>
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <MathText>{problem.content}</MathText>
                </div>
              </div>

              {/* Tags */}
              {problem.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {problem.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Solution Input */}
          {!isCorrectlySolved && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Your Solution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitAnswer} className="space-y-4">
                  <Textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Enter your answer here... You can use LaTeX notation like $x = 2$ or $$\int x dx$$"
                    className="min-h-[120px] resize-y"
                  />
                  
                  {lastAttempt && (
                    <div className={`p-4 rounded-lg border ${
                      attempts[0]?.isCorrect 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-start gap-2">
                        {attempts[0]?.isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">
                            {attempts[0]?.isCorrect ? 'Correct!' : 'Incorrect'}
                          </p>
                          {lastAttempt.feedback && (
                            <p className="text-sm mt-1">
                              <MathText>{lastAttempt.feedback}</MathText>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Button type="submit" disabled={submitting || !userAnswer.trim()}>
                    {submitting ? 'Submitting...' : 'Submit Answer'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Hints */}
          {problem.hints.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Hints ({hintsUnlocked}/{problem.hints.length})
                  </CardTitle>
                  {hasMoreHints && !isCorrectlySolved && (
                    <Button
                      variant="outline"
                      onClick={handleUnlockHint}
                      disabled={showHintUnlock}
                    >
                      {showHintUnlock ? 'Unlocking...' : 'Unlock Next Hint'}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {hintsUnlocked === 0 ? (
                  <p className="text-gray-600 italic">
                    No hints unlocked yet. Try solving the problem first!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {visibleHints.map((hint, index) => (
                      <div key={hint.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="text-xs">
                            Hint {index + 1}
                          </Badge>
                          <div className="flex-1">
                            <MathText>{hint.content}</MathText>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Solution (if available and user has solved it) */}
          {problem.solution && isCorrectlySolved && (
            <Card>
              <CardHeader>
                <CardTitle>Official Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <MathText>{problem.solution.content}</MathText>
                  {problem.solution.explanation && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Explanation</h4>
                      <MathText>{problem.solution.explanation}</MathText>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* My Attempts */}
          {attempts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Attempts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {attempts.slice(0, 5).map((attempt, index) => (
                    <div key={attempt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {attempt.isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <div className="flex-1">
                          <MathText>{attempt.answer}</MathText>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(attempt.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {attempt.timeSpent}s
                      </div>
                    </div>
                  ))}
                  {attempts.length > 5 && (
                    <p className="text-sm text-gray-600 text-center">
                      ... and {attempts.length - 5} more attempts
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Problem Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">Attempts</span>
                </div>
                <span className="font-semibold">{problem.statistics.totalAttempts}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Success Rate</span>
                </div>
                <span className="font-semibold text-green-600">
                  {Math.round(problem.statistics.successRate)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Solved</span>
                </div>
                <span className="font-semibold text-blue-600">
                  {problem.statistics.successfulAttempts}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Problem Rating */}
          <ProblemRatingComponent 
            problemId={problemId}
            currentRating={problem.rating.userRating}
          />

          {/* Similar Problems */}
          {similarProblems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Similar Problems</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {similarProblems.slice(0, 3).map((similarProblem) => (
                    <Link key={similarProblem.id} href={`/problems/${similarProblem.id}`}>
                      <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <h4 className="font-medium text-sm line-clamp-2 mb-1">
                          {similarProblem.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${PROBLEM_DIFFICULTIES[similarProblem.difficulty].color} border-current`}
                          >
                            {PROBLEM_DIFFICULTIES[similarProblem.difficulty].name}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{similarProblem.rating.average.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      </main>
    </div>
  );
}