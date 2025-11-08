'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Problem, PROBLEM_CATEGORY_INFO, PROBLEM_DIFFICULTY_INFO } from '@/types/problem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MathText } from '@/components/ui/math-renderer';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import problemService from '@/services/problemService';
import Header from '@/components/layout/Header';
import MonacoCodeEditor from '@/components/problems/MonacoCodeEditor';
import {
  Heart,
  Bookmark,
  Share2,
  Clock,
  Users,
  Star,
  Lightbulb,
  ArrowLeft,
  Eye,
  BookOpen,
  GraduationCap,
  FileText,
  Sparkles,
  Target,
  CheckCircle,
  Trophy,
  Save,
  RotateCcw,
  Timer,
  Brain,
  Code2,
  Play,
  UploadCloud,
  Terminal,
} from 'lucide-react';

const CODE_LANGUAGES = [
  {
    id: 'javascript',
    label: 'JavaScript',
    template: `function solve(input) {
  // Write your solution here
  return input;
}
`,
  },
  {
    id: 'python',
    label: 'Python',
    template: `def solve(data):
    """Write your solution here"""
    return data
`,
  },
  {
    id: 'cpp',
    label: 'C++',
    template: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    // Write your solution here
    return 0;
}
`,
  },
] as const;

type CodeLanguage = (typeof CODE_LANGUAGES)[number]['id'];

interface SolveSession {
  startTime: number;
  timeSpent: number;
  hintsUsed: number;
  attempts: number;
}

interface WorkspaceTestCase {
  id: string;
  name: string;
  input: string;
  expected: string;
}

const DEFAULT_TEST_CASES: WorkspaceTestCase[] = [
  { id: 'case-1', name: 'Case 1', input: '', expected: '' },
  { id: 'case-2', name: 'Case 2', input: '', expected: '' },
  { id: 'case-3', name: 'Case 3', input: '', expected: '' },
];

type ExecutionStatus = 'idle' | 'running' | 'success' | 'error';

interface ExecutionState {
  status: ExecutionStatus;
  message: string;
  output?: string;
}

const EXECUTION_STATE_STYLES: Record<ExecutionStatus, string> = {
  idle: 'border-slate-800 bg-slate-950 text-slate-100',
  running: 'border-blue-500/40 bg-blue-500/10 text-blue-100',
  success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100',
  error: 'border-rose-500/40 bg-rose-500/10 text-rose-100',
};

const createDefaultCodeSnippets = (): Record<CodeLanguage, string> => {
  return CODE_LANGUAGES.reduce(
    (acc, lang) => {
      acc[lang.id] = lang.template;
      return acc;
    },
    {} as Record<CodeLanguage, string>
  );
};

export default function ProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.id as string;
  const intervalRef = useRef<NodeJS.Timeout>();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [session, setSession] = useState<SolveSession>({
    startTime: Date.now(),
    timeSpent: 0,
    hintsUsed: 0,
    attempts: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>(CODE_LANGUAGES[0].id);
  const [codeSnippets, setCodeSnippets] =
    useState<Record<CodeLanguage, string>>(createDefaultCodeSnippets);
  const [testCases, setTestCases] = useState<WorkspaceTestCase[]>(() =>
    DEFAULT_TEST_CASES.map((testCase) => ({ ...testCase }))
  );
  const [activeTestCase, setActiveTestCase] = useState<string>(DEFAULT_TEST_CASES[0].id);
  const [customInput, setCustomInput] = useState('');
  const [executionState, setExecutionState] = useState<ExecutionState>({
    status: 'idle',
    message: 'Ready to run your code against the sample cases.',
  });

  const loadProblemDetails = useCallback(async () => {
    if (!problemId) return;
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
  }, [problemId, router]);

  useEffect(() => {
    if (problemId) {
      loadProblemDetails();
    }

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
  }, [problemId, loadProblemDetails]);

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const solverHints = [
    'Start by rewriting the prompt in your own words and isolate the unknowns.',
    'Can you reduce the problem to a smaller case or substitute a simpler value?',
    'Look for invariants or conservation laws — they often simplify complex systems.',
    'Sketch a diagram or table to organize the information visually.',
    'Check boundary cases to ensure your approach satisfies extreme scenarios.',
  ];

  const checkSolution = (userAnswer: string, correctSolution?: string): boolean => {
    if (!correctSolution) return false;
    const normalize = (str: string) =>
      str.toLowerCase().replace(/\s+/g, '').replace(/[{}]/g, '').trim();
    return normalize(userAnswer) === normalize(correctSolution);
  };

  const handleSubmitSolution = async () => {
    if (!finalAnswer.trim()) return;

    setSubmitting(true);
    setSession((prev) => ({ ...prev, attempts: prev.attempts + 1 }));

    try {
      const isCorrect = checkSolution(finalAnswer.trim(), problem?.solution);
      if (isCorrect) {
        setIsCompleted(true);
      } else {
        alert('Not quite right. Review your work and try again.');
      }
    } catch (error) {
      console.error('Failed to submit solution:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const requestHint = () => {
    setSession((prev) => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));

    const hints = solverHints;
    const currentHint = hints[Math.min(session.hintsUsed, hints.length - 1)];
    setTimeout(() => {
      alert(`Hint: ${currentHint}`);
    }, 300);
  };

  const resetSession = () => {
    setSession({
      startTime: Date.now(),
      timeSpent: 0,
      hintsUsed: 0,
      attempts: 0,
    });
    setFinalAnswer('');
    setIsCompleted(false);
    setExecutionState({
      status: 'idle',
      message: 'Ready to run your code against the sample cases.',
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const saveProgress = () => {
    const sessionData = {
      problemId,
      session,
      finalAnswer,
      codeSnippets,
      testCases,
    };
    localStorage.setItem(`solve_session_${problemId}`, JSON.stringify(sessionData));
    alert('Progress saved!');
  };

  const loadProgress = () => {
    const savedData = localStorage.getItem(`solve_session_${problemId}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setSession(parsed.session);
        setFinalAnswer(parsed.finalAnswer || '');
        setCodeSnippets(parsed.codeSnippets || createDefaultCodeSnippets());
        setTestCases(parsed.testCases || DEFAULT_TEST_CASES);
        alert('Progress loaded!');
      } catch (error) {
        console.error('Failed to load progress:', error);
      }
    }
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value as CodeLanguage);
  };

  const handleCodeChange = (value: string) => {
    setCodeSnippets((prev) => ({
      ...prev,
      [selectedLanguage]: value,
    }));
  };

  const handleTestCaseChange = (
    testCaseId: string,
    field: keyof Pick<WorkspaceTestCase, 'input' | 'expected'>,
    value: string
  ) => {
    setTestCases((prev) =>
      prev.map((testCase) =>
        testCase.id === testCaseId ? { ...testCase, [field]: value } : testCase
      )
    );
  };

  const applyCaseToCustomInput = () => {
    const activeCase = testCases.find((testCase) => testCase.id === activeTestCase);
    if (activeCase) {
      setCustomInput(activeCase.input);
    }
  };

  const handleRunCode = () => {
    const currentSnippet = codeSnippets[selectedLanguage];

    if (!currentSnippet.trim()) {
      setExecutionState({
        status: 'error',
        message: 'Please add some code before running the test case.',
      });
      return;
    }

    setExecutionState({
      status: 'running',
      message: 'Running your code against the active test case...',
      output: undefined,
    });

    setTimeout(() => {
      const activeCase = testCases.find((testCase) => testCase.id === activeTestCase);
      setExecutionState({
        status: 'success',
        message: 'Execution finished. Connect a judge service for real results.',
        output:
          customInput.trim() ||
          activeCase?.input ||
          'No input provided. Add test data to see it here.',
      });
    }, 900);
  };

  const handleSubmitCode = () => {
    const currentSnippet = codeSnippets[selectedLanguage];

    if (!currentSnippet.trim()) {
      setExecutionState({
        status: 'error',
        message: 'Please write some code before submitting your solution.',
      });
      return;
    }

    setExecutionState({
      status: 'running',
      message: 'Submitting your solution for evaluation...',
      output: undefined,
    });

    setSession((prev) => ({ ...prev, attempts: prev.attempts + 1 }));

    setTimeout(() => {
      const lines = currentSnippet.split('\n').length;
      setExecutionState({
        status: 'success',
        message: 'Submission received! Hook this up to the API to view verdicts.',
        output: `Language: ${selectedLanguage.toUpperCase()}\nTotal lines: ${lines}`,
      });
    }, 1200);
  };

  const executionAlertClasses = EXECUTION_STATE_STYLES[executionState.status];
  const isExecuting = executionState.status === 'running';
  const activeTestCaseData = testCases.find((testCase) => testCase.id === activeTestCase);
  const canCopyActiveCase = Boolean(activeTestCaseData?.input.trim());

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header />
        <div className="w-full px-6 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4 bg-slate-800" />
            <Skeleton className="h-4 w-1/2 bg-slate-800" />
            <Skeleton className="h-32 w-full bg-slate-800" />
            <Skeleton className="h-48 w-full bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Header />
        <div className="w-full px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Problem not found</h1>
            <Button onClick={() => router.push('/problems')}>Back to Problems</Button>
          </div>
        </div>
      </div>
    );
  }

  const categoryInfo = PROBLEM_CATEGORY_INFO[problem.category];
  const difficultyInfo = PROBLEM_DIFFICULTY_INFO[problem.difficulty];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />

      <div className="w-full px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/problems')}
            className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Problems
          </Button>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <Eye className="w-4 h-4" />
            <span>{problem.viewCount?.toLocaleString?.() ?? 0} views</span>
            <Users className="w-4 h-4" />
            <span>{problem.attemptCount?.toLocaleString?.() ?? 0} attempts</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-blue-400" />
              <span className="font-mono text-white">{formatTime(session.timeSpent)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">{session.attempts} attempts</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-slate-300">{session.hintsUsed} hints</span>
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

        {isCompleted && (
          <Alert className="mb-8 border-emerald-400/30 bg-emerald-500/10 text-emerald-50">
            <Trophy className="w-4 h-4 text-emerald-300" />
            <AlertDescription>
              🎉 Congratulations! You solved the problem in {formatTime(session.timeSpent)} with{' '}
              {session.attempts} attempt(s)!
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <section className="flex-1 space-y-6">
            <Card className="bg-slate-900/80 border border-slate-800">
              <CardContent className="space-y-4 pt-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="bg-slate-800 text-slate-200 border border-slate-700">
                    {categoryInfo?.name || problem.category}
                  </Badge>
                  <Badge className="bg-slate-800 text-slate-200 border border-slate-700">
                    {(difficultyInfo?.name || problem.difficulty).toUpperCase()}
                  </Badge>
                  {problem.avgRating && (
                    <div className="flex items-center gap-1 text-amber-300 text-sm">
                      <Star className="w-4 h-4 fill-current" />
                      {problem.avgRating.toFixed(1)} ({problem._count?.ratings || 0})
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{problem.title}</h1>
                    {problem.creator && (
                      <div className="flex items-center gap-3 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-7 h-7 border border-slate-700">
                            <AvatarImage src={problem.creator.profileImage} />
                            <AvatarFallback className="bg-slate-800 text-slate-200 text-xs">
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
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleToggleFavorite}
                      className="text-slate-300 hover:text-white"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFavorited ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                        }`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleToggleBookmark}
                      className="text-slate-300 hover:text-white"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          isBookmarked ? 'fill-emerald-400 text-emerald-400' : 'text-slate-400'
                        }`}
                      />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BookOpen className="w-5 h-5 text-emerald-300" />
                  Problem Statement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MathText className="text-slate-200 leading-relaxed">
                  {problem.description}
                </MathText>
                {problem.tags && Array.isArray(problem.tags) && problem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800">
                    {problem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-slate-800 text-slate-200 text-xs border border-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="pt-4 border-t border-slate-800">
                  <Button
                    onClick={requestHint}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800"
                    disabled={session.hintsUsed >= 3}
                  >
                    <Lightbulb className="w-4 h-4 text-amber-300" />
                    Request Hint ({Math.max(0, 3 - session.hintsUsed)} left)
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="w-5 h-5 text-cyan-300" />
                  Detailed Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <MathText className="text-slate-300">
                  {problem.description || 'Explore the mathematical structure behind this prompt.'}
                </MathText>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { label: 'Difficulty Level', value: difficultyInfo?.level || 'N/A' },
                    { label: 'Total Views', value: problem.viewCount?.toLocaleString?.() ?? 0 },
                    { label: 'Attempts', value: problem.attemptCount?.toLocaleString?.() ?? 0 },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl bg-slate-900/70 border border-slate-800 p-4 text-center"
                    >
                      <div className="text-3xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-slate-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {problem.solution && (
              <Card className="bg-slate-900/80 border border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <GraduationCap className="w-5 h-5 text-indigo-300" />
                    Solution & Explanation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <h4 className="font-semibold text-emerald-300 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Complete Solution
                    </h4>
                    <MathText className="text-slate-200 leading-relaxed">
                      {problem.solution}
                    </MathText>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>

          <div
            className="space-y-6 w-full lg:w-1/2 lg:min-w-[420px] lg:flex-none"
            style={{ resize: 'horizontal', overflow: 'auto' }}
          >
            <Card className="bg-slate-900/80 border border-slate-800">
              <CardHeader>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Code2 className="w-5 h-5 text-emerald-300" />
                    Code Workspace
                  </CardTitle>
                  <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="w-[200px] bg-slate-950 border-slate-800 text-slate-100">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 text-slate-100 border-slate-800">
                        {CODE_LANGUAGES.map((language) => (
                          <SelectItem key={language.id} value={language.id}>
                            {language.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRunCode}
                        disabled={isExecuting}
                        className="border-slate-700 text-slate-100"
                      >
                        <Play className="w-4 h-4" />
                        Run
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSubmitCode}
                        disabled={isExecuting}
                        className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 hover:opacity-90"
                      >
                        <UploadCloud className="w-4 h-4" />
                        Submit
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <MonacoCodeEditor
                  value={codeSnippets[selectedLanguage]}
                  language={selectedLanguage}
                  onChange={(nextValue) => handleCodeChange(nextValue)}
                  height={360}
                />

                <div className="space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium text-slate-200">Testcases</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={applyCaseToCustomInput}
                      disabled={!canCopyActiveCase}
                      className="text-emerald-300 hover:text-emerald-200"
                    >
                      Use Case in Custom Input
                    </Button>
                  </div>
                  <Tabs value={activeTestCase} onValueChange={setActiveTestCase}>
                    <TabsList className="flex flex-wrap gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
                      {testCases.map((testCase) => (
                        <TabsTrigger key={testCase.id} value={testCase.id} className="text-xs">
                          {testCase.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {testCases.map((testCase) => (
                      <TabsContent key={testCase.id} value={testCase.id} className="mt-4">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-200">Input</label>
                            <Textarea
                              rows={4}
                              placeholder="Enter the raw input for this test case..."
                              value={testCase.input}
                              onChange={(event) =>
                                handleTestCaseChange(testCase.id, 'input', event.target.value)
                              }
                              className="font-mono text-sm bg-slate-950 border-slate-800 text-slate-100"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-200">
                              Expected Output
                            </label>
                            <Textarea
                              rows={4}
                              placeholder="Document the expected output..."
                              value={testCase.expected}
                              onChange={(event) =>
                                handleTestCaseChange(testCase.id, 'expected', event.target.value)
                              }
                              className="font-mono text-sm bg-slate-950 border-slate-800 text-slate-100"
                            />
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">Custom Input</label>
                    <Textarea
                      rows={5}
                      placeholder="Paste the exact input you would like to run..."
                      value={customInput}
                      onChange={(event) => setCustomInput(event.target.value)}
                      className="font-mono text-sm bg-slate-950 border-slate-800 text-slate-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-medium text-slate-200">
                      <span className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-slate-400" />
                        Execution Result
                      </span>
                      <Badge
                        variant="outline"
                        className="capitalize border-slate-700 text-slate-100"
                      >
                        {executionState.status}
                      </Badge>
                    </div>
                    <Alert className={`${executionAlertClasses} space-y-2`}>
                      <AlertDescription>
                        <p className="font-medium">{executionState.message}</p>
                        {executionState.output && (
                          <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-black/5 p-3 text-xs font-mono">
                            {executionState.output}
                          </pre>
                        )}
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </CardContent>
            </Card>

            {!isCompleted && (
              <Card className="bg-slate-900/80 border border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Target className="w-5 h-5 text-cyan-300" />
                    Final Answer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={finalAnswer}
                    onChange={(event) => setFinalAnswer(event.target.value)}
                    placeholder="Enter your final answer..."
                    rows={3}
                    className="font-mono text-sm bg-slate-950 border-slate-800 text-slate-100"
                  />

                  <Button
                    onClick={handleSubmitSolution}
                    disabled={submitting || !finalAnswer.trim()}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 hover:opacity-90"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {submitting ? 'Submitting...' : 'Submit Final Answer'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {isCompleted && problem.solution && (
              <Card className="bg-slate-900/80 border border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Trophy className="w-5 h-5 text-yellow-300" />
                    Official Solution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
                    <MathText className="text-slate-100 leading-relaxed">
                      {problem.solution}
                    </MathText>
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
