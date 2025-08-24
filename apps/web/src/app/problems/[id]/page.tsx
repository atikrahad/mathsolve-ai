'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Problem, PROBLEM_CATEGORY_INFO, PROBLEM_DIFFICULTY_INFO } from '@/types/problem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MathRenderer, MathText } from '@/components/ui/math-renderer';
import { MathEditor } from '@/components/ui/math-editor';
import { Skeleton } from '@/components/ui/skeleton';
import problemService from '@/services/problemService';
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
  Edit,
  Eye,
  Calculator,
  Send,
  Trophy,
  Timer,
  BookOpen
} from 'lucide-react';

interface SolutionAttempt {
  id?: string;
  answer: string;
  isCorrect?: boolean;
  feedback?: string;
  timeSpent?: number;
  hintsUsed?: number;
  submittedAt?: string;
}

export default function ProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.id as string;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [attempts, setAttempts] = useState<SolutionAttempt[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState<SolutionAttempt | null>(null);
  const [startTime] = useState(Date.now());
  const [showSolution, setShowSolution] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (problemId) {
      loadProblemDetails();
    }
  }, [problemId]);

  const loadProblemDetails = async () => {
    setLoading(true);
    try {
      const problemData = await problemService.getProblemById(problemId);
      setProblem(problemData);
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
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    try {
      // For now, we'll simulate solution checking
      // TODO: Implement actual API endpoint for solution checking
      const isCorrect = checkSolution(userAnswer.trim(), problem?.solution);
      
      const attempt: SolutionAttempt = {
        id: Date.now().toString(),
        answer: userAnswer.trim(),
        isCorrect,
        feedback: isCorrect 
          ? "Excellent work! Your solution is correct." 
          : "That's not quite right. Try reviewing the problem and your approach.",
        timeSpent,
        hintsUsed: 0,
        submittedAt: new Date().toISOString()
      };

      setCurrentAttempt(attempt);
      setAttempts(prev => [attempt, ...prev]);
      
      // If correct, show the solution
      if (isCorrect) {
        setShowSolution(true);
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Simple solution checking (in production, this would be done on the server)
  const checkSolution = (userAnswer: string, correctSolution?: string): boolean => {
    if (!correctSolution) return false;
    
    // Normalize both answers for comparison
    const normalize = (str: string) => 
      str.toLowerCase()
         .replace(/\s+/g, '')
         .replace(/[{}]/g, '')
         .trim();
    
    return normalize(userAnswer) === normalize(correctSolution);
  };

  const handleNewAttempt = () => {
    setUserAnswer('');
    setCurrentAttempt(null);
  };

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // TODO: Implement API call
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Implement API call
  };

  const formatTimeSpent = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Problem not found</h1>
            <Button onClick={() => router.push('/problems')}>
              Back to Problems
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const categoryInfo = PROBLEM_CATEGORY_INFO[problem.category];
  const difficultyInfo = PROBLEM_DIFFICULTY_INFO[problem.difficulty];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/problems')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Problems
            </Button>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className={`w-3 h-3 rounded-full ${categoryInfo?.color || 'bg-gray-400'}`}
                  title={categoryInfo?.name}
                />
                <Badge variant="outline" className={`${difficultyInfo?.color} border-current`}>
                  {difficultyInfo?.name || problem.difficulty}
                </Badge>
                {problem.avgRating && (
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm text-gray-600">
                      {problem.avgRating.toFixed(1)} ({problem._count?.ratings || 0})
                    </span>
                  </div>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{problem.title}</h1>
              
              {problem.creator && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={problem.creator.profileImage} />
                      <AvatarFallback className="text-xs">
                        {problem.creator.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>by {problem.creator.username}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(problem.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Link href={`/problems/${problemId}/solve`}>
                <Button className="flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Solve Problem
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleFavorite}
                className="flex items-center gap-2"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                Favorite
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleBookmark}
                className="flex items-center gap-2"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-blue-500 text-blue-500' : 'text-gray-400'}`} />
                Bookmark
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Problem Statement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Problem Statement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <MathText className="text-lg leading-relaxed">{problem.description}</MathText>
                </div>
                
                {/* Tags */}
                {problem.tags && Array.isArray(problem.tags) && problem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                    {problem.tags.map((tag, index) => (
                      <Badge key={`${tag}-${index}`} variant="secondary" className="text-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Solution Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Your Solution
                  {currentAttempt?.isCorrect && (
                    <Badge className="bg-green-100 text-green-800">Correct!</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!currentAttempt ? (
                  <form onSubmit={handleSubmitAnswer} className="space-y-4">
                    <MathEditor
                      value={userAnswer}
                      onChange={setUserAnswer}
                      placeholder="Enter your solution using mathematical notation..."
                      showPreview={true}
                      showShortcuts={true}
                      rows={6}
                    />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Timer className="w-4 h-4" />
                        <span>Time: {formatTimeSpent(Math.floor((Date.now() - startTime) / 1000))}</span>
                      </div>
                      <Button 
                        type="submit" 
                        disabled={submitting || !userAnswer.trim()}
                        className="flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        {submitting ? 'Submitting...' : 'Submit Solution'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {/* Attempt Result */}
                    <div className={`p-4 rounded-lg border ${
                      currentAttempt.isCorrect 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {currentAttempt.isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className={`font-semibold ${
                          currentAttempt.isCorrect ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {currentAttempt.isCorrect ? 'Correct!' : 'Incorrect'}
                        </span>
                      </div>
                      <p className={`text-sm ${
                        currentAttempt.isCorrect ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {currentAttempt.feedback}
                      </p>
                    </div>

                    {/* Your Answer */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Your Answer:</h4>
                      <MathText className="text-lg">{currentAttempt.answer}</MathText>
                    </div>

                    {/* Try Again Button */}
                    {!currentAttempt.isCorrect && (
                      <Button onClick={handleNewAttempt} className="w-full">
                        Try Again
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Official Solution */}
            {(showSolution || currentAttempt?.isCorrect) && problem.solution && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    Official Solution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <MathText className="text-lg leading-relaxed">{problem.solution}</MathText>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Views</span>
                    </div>
                    <span className="font-semibold">{problem.viewCount || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Attempts</span>
                    </div>
                    <span className="font-semibold">{problem.attemptCount || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Quality Score</span>
                    </div>
                    <span className="font-semibold">{problem.qualityScore?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Attempts */}
            {attempts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Attempts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {attempts.map((attempt) => (
                      <div key={attempt.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {attempt.isCorrect ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span className={`text-sm font-medium ${
                              attempt.isCorrect ? 'text-green-800' : 'text-red-800'
                            }`}>
                              {attempt.isCorrect ? 'Correct' : 'Incorrect'}
                            </span>
                          </div>
                          {attempt.timeSpent && (
                            <span className="text-xs text-gray-500">
                              {formatTimeSpent(attempt.timeSpent)}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-600">
                          <MathText>{attempt.answer}</MathText>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}