'use client';

// @ts-nocheck - Temporary fix for React component type compatibility issues
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ProblemCategory,
  ProblemDifficulty,
  PROBLEM_CATEGORIES,
  PROBLEM_DIFFICULTIES,
  PROBLEM_CATEGORY_INFO,
  PROBLEM_DIFFICULTY_INFO,
  CreateProblemData,
} from '@/types/problem';
import problemService from '@/services/problemService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { MathText } from '@/components/ui/math-renderer';
import { MathEditor } from '@/components/ui/math-editor';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import {
  ArrowLeft,
  Plus,
  X,
  Eye,
  EyeOff,
  Save,
  Lightbulb,
  Target,
  BookOpen,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Upload,
  FileText,
  Zap,
  Globe,
  Lock,
  Info,
  Star,
  TrendingUp,
  Users,
  Calculator,
} from 'lucide-react';

export default function CreateProblemPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<ProblemCategory | ''>('');
  const [difficulty, setDifficulty] = useState<ProblemDifficulty | ''>('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [solution, setSolution] = useState('');
  const [hints, setHints] = useState<string[]>(['']);
  const [isPublished, setIsPublished] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (title.length < 5) newErrors.title = 'Title must be at least 5 characters';
    if (title.length > 200) newErrors.title = 'Title must be less than 200 characters';
    if (description.length < 20)
      newErrors.description = 'Description must be at least 20 characters';
    if (description.length > 1000)
      newErrors.description = 'Description must be less than 1000 characters';
    if (content.length < 10) newErrors.content = 'Problem content must be at least 10 characters';
    if (!category) newErrors.category = 'Please select a category';
    if (!difficulty) newErrors.difficulty = 'Please select a difficulty';
    if (tags.length === 0) newErrors.tags = 'At least one tag is required';
    if (tags.length > 10) newErrors.tags = 'Maximum 10 tags allowed';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form submission attempt:', {
      title: title.length,
      description: description.length,
      content: content.length,
      category,
      difficulty,
      tagsCount: tags.length,
      tags,
    });

    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      alert(
        'Please fill out all required fields:\n' +
          Object.entries(errors)
            .map(([field, error]) => `• ${field}: ${error}`)
            .join('\n')
      );
      return;
    }

    setSubmitting(true);
    try {
      const problemData: CreateProblemData = {
        title,
        description,
        category: category as ProblemCategory,
        difficulty: difficulty as ProblemDifficulty,
        tags,
        solution: solution.trim() || undefined,
      };

      console.log('Creating problem with data:', problemData);

      // Call the API to create the problem
      const createdProblem = await problemService.createProblem(problemData);

      console.log('Problem created successfully:', createdProblem);

      // Show success message
      alert(
        `✅ Problem Created Successfully!\\n\\nTitle: ${problemData.title}\\nCategory: ${PROBLEM_CATEGORY_INFO[problemData.category]?.name}\\nDifficulty: ${PROBLEM_DIFFICULTY_INFO[problemData.difficulty]?.name}\\nProblem ID: ${createdProblem.id}\\n\\n✨ Your problem has been saved to the database!`
      );

      // Reset form or redirect
      const shouldReset = confirm('Would you like to create another problem?');
      if (shouldReset) {
        // Reset form
        setTitle('');
        setDescription('');
        setContent('');
        setCategory('');
        setDifficulty('');
        setTags([]);
        setSolution('');
        setNewTag('');
      } else {
        // Redirect to the created problem page
        router.push(`/problems/${createdProblem.id}`);
      }
    } catch (error: any) {
      console.error('Failed to create problem:', error);
      let errorMessage = 'Failed to create problem. ';

      if (error.response?.status === 401) {
        errorMessage += 'Please log in to create problems.';
      } else if (error.response?.status === 400) {
        errorMessage += 'Invalid problem data. Please check all fields.';
      } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        errorMessage += 'Backend server is not running. Please start the backend server.';
      } else {
        errorMessage += `Error: ${error.message || 'Unknown error occurred'}`;
      }

      alert('❌ ' + errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = newTag.trim().toLowerCase();
      if (tag && !tags.includes(tag) && tags.length < 10) {
        setTags([...tags, tag]);
        setNewTag('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const addTagFromButton = () => {
    const tag = newTag.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag]);
      setNewTag('');
    }
  };

  const addHint = () => {
    setHints([...hints, '']);
  };

  const removeHint = (index: number) => {
    if (hints.length > 1) {
      setHints(hints.filter((_, i) => i !== index));
    }
  };

  const updateHint = (index: number, value: string) => {
    const newHints = [...hints];
    newHints[index] = value;
    setHints(newHints);
  };

  const steps = [
    {
      id: 1,
      name: 'Problem Info',
      icon: BookOpen,
      completed: title && description && category && difficulty,
    },
    { id: 2, name: 'Content', icon: FileText, completed: content && tags.length > 0 },
    { id: 3, name: 'Enhance', icon: Lightbulb, completed: false },
    { id: 4, name: 'Publish', icon: Globe, completed: false },
  ];

  const progressPercentage = (steps.filter((step) => step.completed).length / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 mb-8 shadow-xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/problems">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Problems
                </Button>
              </Link>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  Create Amazing Problems
                  <Sparkles className="inline-block w-8 h-8 ml-2 text-yellow-300" />
                </h1>
                <p className="text-xl text-blue-100 max-w-2xl">
                  Share your mathematical creativity with the world. Design problems that challenge,
                  educate, and inspire learners everywhere.
                </p>
              </div>

              <div className="lg:w-80">
                {/* Progress Card */}
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-medium">Progress</span>
                    <span className="text-white/80 text-sm">{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                    <div
                      className="bg-gradient-to-r from-yellow-300 to-orange-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex gap-3">
                    {steps.map((step) => (
                      <div
                        key={step.id}
                        className={`flex-1 flex items-center justify-center p-2 rounded-lg transition-all ${
                          step.completed
                            ? 'bg-green-500/30 text-green-200'
                            : 'bg-white/10 text-white/60'
                        }`}
                      >
                        <step.icon className="w-4 h-4" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Form */}
          <div className="xl:col-span-3">
            {/* Backend Integration Notice */}
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-green-900 mb-1">✨ Backend Integrated</p>
                  <p className="text-green-700">
                    Problems will be saved to the database. Fill out required fields marked with{' '}
                    <Star className="w-3 h-3 text-amber-500 inline mx-1" /> to create.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Problem Information */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-900">Problem Information</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          Start with the basics - title, description, and classification
                        </p>
                      </div>
                    </div>
                    <Badge variant={steps[0].completed ? 'default' : 'outline'} className="px-3">
                      Step 1
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-8 space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="title"
                      className="text-lg font-semibold text-gray-900 flex items-center gap-2"
                    >
                      Problem Title
                      <Star className="w-4 h-4 text-amber-500" />
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Find the derivative of a complex function"
                      className="text-lg h-14 bg-white border-2 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                    {errors.title && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm">{errors.title}</span>
                      </div>
                    )}
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      Make it descriptive and engaging - this is what learners see first!
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-lg font-semibold text-gray-900 flex items-center gap-2"
                    >
                      Problem Description
                      <Star className="w-4 h-4 text-amber-500" />
                    </Label>
                    <MathEditor
                      value={description}
                      onChange={setDescription}
                      placeholder="Provide context, background, and what students should know before attempting this problem..."
                      showPreview={true}
                      showShortcuts={false}
                      rows={4}
                    />
                    <div className="flex justify-between items-center">
                      {errors.description ? (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm">{errors.description}</span>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Lightbulb className="w-3 h-3" />
                          You can use LaTeX math notation like $x^2$ or $$\int x dx$$
                        </div>
                      )}
                      <span className="text-xs text-gray-400">{description.length}/1000</span>
                    </div>
                  </div>

                  {/* Category and Difficulty */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        Category
                        <Star className="w-4 h-4 text-amber-500" />
                      </Label>
                      <Select
                        value={category}
                        onValueChange={(value) => setCategory(value as ProblemCategory)}
                      >
                        <SelectTrigger className="h-12 bg-white border-2 focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
                          <SelectValue placeholder="Choose a mathematics category" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROBLEM_CATEGORIES.map((cat) => {
                            const info = PROBLEM_CATEGORY_INFO[cat];
                            return (
                              <SelectItem key={cat} value={cat} className="py-3">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-8 h-8 rounded-lg ${info.color} flex items-center justify-center`}
                                  >
                                    <span className="text-white text-lg">{info.icon}</span>
                                  </div>
                                  <div>
                                    <div className="font-medium">{info.name}</div>
                                    <div className="text-xs text-gray-500">{info.description}</div>
                                  </div>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm">{errors.category}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        Difficulty Level
                        <Star className="w-4 h-4 text-amber-500" />
                      </Label>
                      <Select
                        value={difficulty}
                        onValueChange={(value) => setDifficulty(value as ProblemDifficulty)}
                      >
                        <SelectTrigger className="h-12 bg-white border-2 focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
                          <SelectValue placeholder="Select difficulty level" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROBLEM_DIFFICULTIES.map((diff) => {
                            const info = PROBLEM_DIFFICULTY_INFO[diff];
                            return (
                              <SelectItem key={diff} value={diff} className="py-3">
                                <div className="flex items-center gap-3">
                                  <div className="flex">
                                    {[...Array(info.level)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 fill-amber-400 text-amber-400"
                                      />
                                    ))}
                                    {[...Array(3 - info.level)].map((_, i) => (
                                      <Star
                                        key={i + info.level}
                                        className="w-4 h-4 text-gray-300"
                                      />
                                    ))}
                                  </div>
                                  <div>
                                    <div className="font-medium">{info.name}</div>
                                    <div className="text-xs text-gray-500">{info.description}</div>
                                  </div>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      {errors.difficulty && (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm">{errors.difficulty}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: Problem Content */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-green-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Target className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-900">Problem Statement</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          Write the actual mathematical problem with full LaTeX support
                        </p>
                      </div>
                    </div>
                    <Badge variant={steps[1].completed ? 'default' : 'outline'} className="px-3">
                      Step 2
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="content"
                      className="text-lg font-semibold text-gray-900 flex items-center gap-2"
                    >
                      Problem Content
                      <Star className="w-4 h-4 text-amber-500" />
                    </Label>
                    <MathEditor
                      value={content}
                      onChange={setContent}
                      placeholder="Write the mathematical problem here. Use LaTeX for formulas: $f(x) = x^2 + 2x + 1$"
                      showPreview={true}
                      showShortcuts={true}
                      rows={8}
                    />
                    {errors.content && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm">{errors.content}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      Tags
                      <Star className="w-4 h-4 text-amber-500" />
                    </Label>
                    <div className="flex gap-3">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="Add tags (press Enter or comma)"
                        className="flex-1 bg-white border-2 focus:border-green-400 focus:ring-4 focus:ring-green-100"
                      />
                      <Button
                        type="button"
                        onClick={addTagFromButton}
                        disabled={
                          !newTag.trim() ||
                          tags.includes(newTag.trim().toLowerCase()) ||
                          tags.length >= 10
                        }
                        className="bg-green-600 hover:bg-green-700 px-6"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>

                    {tags.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Current Tags</span>
                          <span className="text-xs text-gray-500">{tags.length}/10</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="hover:text-red-600 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {errors.tags && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm">{errors.tags}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Step 3: Solution */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-purple-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Lightbulb className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-900">Solution</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          Provide the complete step-by-step solution (optional)
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="px-3">
                      Step 3
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      Official Solution
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </Label>
                    <MathEditor
                      value={solution}
                      onChange={setSolution}
                      placeholder="Provide a complete step-by-step solution..."
                      showPreview={true}
                      showShortcuts={true}
                      rows={6}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit Section */}
              <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-6 rounded-t-2xl shadow-lg">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/problems" className="sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  </Link>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    {submitting ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Save className="w-5 h-5" />
                        Create Problem
                        <Sparkles className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Enhanced Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Preview Card */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm sticky top-8">
              <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-indigo-100">
                <CardTitle className="flex items-center gap-2">
                  {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  Quick Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full mb-4 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>

                {showPreview && (
                  <div className="space-y-4 p-4 border-2 border-dashed border-indigo-200 rounded-xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
                    {title ? (
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                          {title}
                        </h3>
                      </div>
                    ) : (
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    )}

                    <div className="flex gap-2">
                      {category ? (
                        <Badge variant="outline" className="bg-white/80">
                          {PROBLEM_CATEGORY_INFO[category]?.name}
                        </Badge>
                      ) : (
                        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                      )}
                      {difficulty && (
                        <Badge
                          variant="outline"
                          className={`${PROBLEM_DIFFICULTY_INFO[difficulty]?.color} border-current bg-white/80`}
                        >
                          {PROBLEM_DIFFICULTY_INFO[difficulty]?.name}
                        </Badge>
                      )}
                    </div>

                    {description && (
                      <div>
                        <div className="text-sm text-gray-600 line-clamp-3">
                          <MathText>{description}</MathText>
                        </div>
                      </div>
                    )}

                    {content && (
                      <div className="p-3 bg-white/80 rounded-lg border-l-4 border-blue-500">
                        <div className="text-sm">
                          <MathText>{content}</MathText>
                        </div>
                      </div>
                    )}

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs bg-blue-100 text-blue-700"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pro Tips */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-blue-900 mb-1">Clear Problem Statement</p>
                      <p className="text-blue-700">
                        Be specific about what you're asking. Include all necessary information.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Calculator className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-green-900 mb-1">LaTeX Math Editor</p>
                      <p className="text-green-700">
                        Use the math editor with shortcuts like Ctrl+/ for division, Ctrl+Shift+6
                        for powers.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-purple-900 mb-1">Preview Feature</p>
                      <p className="text-purple-700">
                        Always check the preview to see how your math formulas will render.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
