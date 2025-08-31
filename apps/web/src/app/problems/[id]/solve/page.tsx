'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Problem, PROBLEM_CATEGORY_INFO, PROBLEM_DIFFICULTY_INFO } from '@/types/problem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MathText } from '@/components/ui/math-renderer';
import { MathEditor } from '@/components/ui/math-editor';
import { Skeleton } from '@/components/ui/skeleton';
import problemService from '@/services/problemService';
import Header from '@/components/layout/Header';
import {
  ArrowLeft,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  Trophy,
  Lightbulb,
  Save,
  Send,
  RotateCcw,
  Eye,
  BookOpen,
  AlertCircle,
  Timer,
  Brain,
  Zap,
} from 'lucide-react';

interface Step {
  id: string;
  content: string;
  explanation?: string;
  timestamp: number;
}

interface SolveSession {
  startTime: number;
  currentStep: number;
  steps: Step[];
  timeSpent: number;
  hintsUsed: number;
  attempts: number;
}

export default function ProblemSolvePage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.id as string;
  const intervalRef = useRef<NodeJS.Timeout>();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<SolveSession>({
    startTime: Date.now(),
    currentStep: 0,
    steps: [],
    timeSpent: 0,
    hintsUsed: 0,
    attempts: 0,
  });

  const [currentWork, setCurrentWork] = useState('');
  const [stepExplanation, setStepExplanation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState('');
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    if (problemId) {
      loadProblemDetails();
    }

    // Start timer
    intervalRef.current = setInterval(() => {
      setSession((prev) => ({
        ...prev,
        timeSpent: Math.floor((Date.now() - prev.startTime) / 1000),
      }));
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
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

  const addStep = () => {
    if (!currentWork.trim()) return;

    const newStep: Step = {
      id: Date.now().toString(),
      content: currentWork.trim(),
      explanation: stepExplanation.trim() || undefined,
      timestamp: Date.now(),
    };

    setSession((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep],
      currentStep: prev.currentStep + 1,
    }));

    setCurrentWork('');
    setStepExplanation('');
  };

  const removeStep = (stepId: string) => {
    setSession((prev) => ({
      ...prev,
      steps: prev.steps.filter((step) => step.id !== stepId),
      currentStep: Math.max(0, prev.currentStep - 1),
    }));
  };

  const editStep = (stepId: string, newContent: string, newExplanation?: string) => {
    setSession((prev) => ({
      ...prev,
      steps: prev.steps.map((step) =>
        step.id === stepId ? { ...step, content: newContent, explanation: newExplanation } : step
      ),
    }));
  };

  const handleSubmitSolution = async () => {
    if (!finalAnswer.trim()) return;

    setSubmitting(true);
    setSession((prev) => ({ ...prev, attempts: prev.attempts + 1 }));

    try {
      // Simulate solution checking
      const isCorrect = checkSolution(finalAnswer.trim(), problem?.solution);

      if (isCorrect) {
        setIsCompleted(true);
        setShowSolution(true);
      } else {
        // Show feedback and allow retry
        alert('Not quite right. Review your work and try again.');
      }
    } catch (error) {
      console.error('Failed to submit solution:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const checkSolution = (userAnswer: string, correctSolution?: string): boolean => {
    if (!correctSolution) return false;

    const normalize = (str: string) =>
      str.toLowerCase().replace(/\s+/g, '').replace(/[{}]/g, '').trim();

    return normalize(userAnswer) === normalize(correctSolution);
  };

  const requestHint = () => {
    setShowHint(true);
    setSession((prev) => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));

    // Simulate hint based on current progress
    const hints = [
      'Start by identifying what the problem is asking for.',
      'Consider breaking down the problem into smaller parts.',
      'Look for patterns or relationships in the given information.',
      'Try working backwards from what you want to find.',
      'Check if you can use any formulas or theorems you know.',
    ];

    const currentHint = hints[Math.min(session.hintsUsed, hints.length - 1)];
    setTimeout(() => {
      alert(`Hint: ${currentHint}`);
    }, 500);
  };

  const resetSession = () => {
    setSession({
      startTime: Date.now(),
      currentStep: 0,
      steps: [],
      timeSpent: 0,
      hintsUsed: 0,
      attempts: 0,
    });
    setCurrentWork('');
    setStepExplanation('');
    setFinalAnswer('');
    setIsCompleted(false);
    setShowSolution(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const saveProgress = () => {
    // TODO: Implement progress saving to local storage or API
    const sessionData = {
      problemId,
      session,
      currentWork,
      stepExplanation,
      finalAnswer,
    };
    localStorage.setItem(`solve_session_${problemId}`, JSON.stringify(sessionData));
    alert('Progress saved!');
  };

  const loadProgress = () => {
    // TODO: Implement progress loading from local storage or API
    const savedData = localStorage.getItem(`solve_session_${problemId}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setSession(parsed.session);
        setCurrentWork(parsed.currentWork || '');
        setStepExplanation(parsed.stepExplanation || '');
        setFinalAnswer(parsed.finalAnswer || '');
        alert('Progress loaded!');
      } catch (error) {
        console.error('Failed to load progress:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
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
            <Button onClick={() => router.push('/problems')}>Back to Problems</Button>
          </div>
        </div>
      </div>
    );
  }

  const categoryInfo = PROBLEM_CATEGORY_INFO[problem.category];
  const difficultyInfo = PROBLEM_DIFFICULTY_INFO[problem.difficulty];
  const progressPercentage = problem.solution
    ? Math.min((session.steps.length / 5) * 100, 100) // Estimate progress
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push(`/problems/${problemId}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Problem
            </Button>

            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${categoryInfo?.color || 'bg-gray-400'}`}
                title={categoryInfo?.name}
              />
              <Badge variant="outline" className={`${difficultyInfo?.color} border-current`}>
                {difficultyInfo?.name || problem.difficulty}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-blue-600" />
                <span className="font-mono">{formatTime(session.timeSpent)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-600" />
                <span>{session.steps.length} steps</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <span>{session.hintsUsed} hints</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={saveProgress}>
                <Save className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={loadProgress}>
                Load
              </Button>
              <Button variant="outline" size="sm" onClick={resetSession}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {!isCompleted && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Solution Progress</span>
              <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        {/* Success Alert */}
        {isCompleted && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <Trophy className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">
              🎉 Congratulations! You solved the problem in {formatTime(session.timeSpent)} with{' '}
              {session.attempts} attempt(s)!
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Problem Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Problem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">{problem.title}</h3>
                  <div className="prose max-w-none">
                    <MathText>{problem.description}</MathText>
                  </div>

                  {problem.tags && Array.isArray(problem.tags) && problem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-3 border-t">
                      {problem.tags.map((tag, index) => (
                        <Badge key={`${tag}-${index}`} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {!isCompleted && (
                    <div className="pt-3 border-t">
                      <Button
                        onClick={requestHint}
                        variant="outline"
                        className="w-full flex items-center gap-2"
                        disabled={session.hintsUsed >= 3}
                      >
                        <Lightbulb className="w-4 h-4" />
                        Request Hint ({3 - session.hintsUsed} left)
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Solution Workspace */}
          <div className="lg:col-span-2 space-y-6">
            {/* Work Area */}
            {!isCompleted && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Step {session.currentStep + 1}: Working Area
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mathematical Work
                      </label>
                      <MathEditor
                        value={currentWork}
                        onChange={setCurrentWork}
                        placeholder="Show your mathematical work for this step..."
                        showPreview={true}
                        showShortcuts={true}
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Step Explanation (Optional)
                      </label>
                      <MathEditor
                        value={stepExplanation}
                        onChange={setStepExplanation}
                        placeholder="Explain what you're doing in this step and why..."
                        showPreview={false}
                        showShortcuts={false}
                        rows={2}
                      />
                    </div>

                    <Button
                      onClick={addStep}
                      disabled={!currentWork.trim()}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Add Step
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Solution Steps */}
            {session.steps.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Solution Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {session.steps.map((step, index) => (
                      <div key={step.id} className="p-4 border border-gray-200 rounded-lg bg-white">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">Step {index + 1}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStep(step.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <div className="p-3 bg-gray-50 rounded">
                            <MathText>{step.content}</MathText>
                          </div>

                          {step.explanation && (
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                              <MathText>{step.explanation}</MathText>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Final Answer */}
            {session.steps.length > 0 && !isCompleted && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Final Answer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <MathEditor
                      value={finalAnswer}
                      onChange={setFinalAnswer}
                      placeholder="Enter your final answer..."
                      showPreview={true}
                      showShortcuts={true}
                      rows={3}
                    />

                    <Button
                      onClick={handleSubmitSolution}
                      disabled={submitting || !finalAnswer.trim()}
                      className="flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      {submitting ? 'Submitting...' : 'Submit Final Answer'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Official Solution (shown after completion) */}
            {isCompleted && problem.solution && (
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
        </div>
      </div>
    </div>
  );
}
