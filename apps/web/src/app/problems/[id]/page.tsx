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
  Trophy,
  BookOpen,
  GraduationCap,
  FileText,
  Award,
  Sparkles
} from 'lucide-react';


export default function ProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.id as string;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
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


  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // TODO: Implement API call
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Implement API call
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

            {/* Extended Problem Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Detailed Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="prose max-w-none">
                    <h4 className="font-semibold text-gray-900 mb-3">Problem Context</h4>
                    <MathText className="text-base leading-relaxed">{problem.description}</MathText>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{difficultyInfo?.level || 'N/A'}</div>
                      <div className="text-sm text-blue-700">Difficulty Level</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{problem.viewCount || 0}</div>
                      <div className="text-sm text-green-700">Total Views</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{problem.attemptCount || 0}</div>
                      <div className="text-sm text-purple-700">Attempts Made</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Objectives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Learning Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Understanding Concepts</h4>
                      <p className="text-gray-600 text-sm">Grasp the fundamental mathematical concepts underlying this {categoryInfo?.name.toLowerCase()} problem.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Problem-Solving Skills</h4>
                      <p className="text-gray-600 text-sm">Develop systematic approaches to analyze and solve similar problems.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Mathematical Reasoning</h4>
                      <p className="text-gray-600 text-sm">Strengthen logical thinking and mathematical proof techniques.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Solution Explanation */}
            {problem.solution && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    Solution & Explanation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Complete Solution
                      </h4>
                      <MathText className="text-lg leading-relaxed">{problem.solution}</MathText>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h5 className="font-semibold text-green-800 mb-2">Key Concepts</h5>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• {categoryInfo?.name} fundamentals</li>
                          <li>• Step-by-step methodology</li>
                          <li>• Mathematical reasoning</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h5 className="font-semibold text-yellow-800 mb-2">Difficulty Level</h5>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`${difficultyInfo?.color} border-current`}>
                            {difficultyInfo?.name}
                          </Badge>
                          <span className="text-sm text-yellow-700">
                            Requires {problem.difficulty.toLowerCase()} level understanding
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hints & Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  Helpful Hints & Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                    <h4 className="font-medium text-amber-800 mb-2">Approach Strategy</h4>
                    <p className="text-amber-700 text-sm">
                      Start by identifying the key elements in the problem statement and organize the given information systematically.
                    </p>
                  </div>
                  <div className="p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded-r-lg">
                    <h4 className="font-medium text-indigo-800 mb-2">Common Mistakes</h4>
                    <p className="text-indigo-700 text-sm">
                      Pay attention to units, signs, and boundary conditions. Double-check your calculations and verify your answer makes sense.
                    </p>
                  </div>
                  <div className="p-4 bg-emerald-50 border-l-4 border-emerald-400 rounded-r-lg">
                    <h4 className="font-medium text-emerald-800 mb-2">Extension Ideas</h4>
                    <p className="text-emerald-700 text-sm">
                      Consider how this problem relates to other {categoryInfo?.name.toLowerCase()} concepts and explore variations or generalizations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                      <TrendingUp className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Success Rate</span>
                    </div>
                    <span className="font-semibold">{problem.qualityScore ? `${(problem.qualityScore * 10).toFixed(0)}%` : 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  Related Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    `Advanced ${categoryInfo?.name}`,
                    'Problem Solving Strategies',
                    'Mathematical Proofs',
                    'Real-World Applications'
                  ].map((topic, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <span className="text-sm font-medium text-gray-800">{topic}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}