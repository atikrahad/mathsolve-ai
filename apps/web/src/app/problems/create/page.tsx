'use client';

// @ts-nocheck - Temporary fix for React component type compatibility issues
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ProblemCategory,
  ProblemDifficulty,
  PROBLEM_CATEGORIES,
  PROBLEM_DIFFICULTIES
} from '@/types/problem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { MathText } from '@/components/ui/math-renderer';
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
  Users
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
    if (description.length < 20) newErrors.description = 'Description must be at least 20 characters';
    if (description.length > 1000) newErrors.description = 'Description must be less than 1000 characters';
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
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    try {
      // Filter out empty hints
      const filteredHints = hints.filter(hint => hint.trim());
      
      const problemData = {
        title,
        description,
        content,
        category: category as ProblemCategory,
        difficulty: difficulty as ProblemDifficulty,
        tags,
        solution: solution.trim() || undefined,
        hints: filteredHints,
        isPublished,
      };

      // Here you would normally call the API
      console.log('Problem data:', problemData);
      alert('Problem would be created here! Check console for data.');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // router.push('/problems');
    } catch (error) {
      console.error('Failed to create problem:', error);
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
    setTags(tags.filter(tag => tag !== tagToRemove));
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
    { id: 1, name: 'Problem Info', icon: BookOpen, completed: title && description && category && difficulty },
    { id: 2, name: 'Content', icon: FileText, completed: content && tags.length > 0 },
    { id: 3, name: 'Enhance', icon: Lightbulb, completed: false },
    { id: 4, name: 'Publish', icon: Globe, completed: false },
  ];

  const progressPercentage = ((steps.filter(step => step.completed).length) / steps.length) * 100;

  return (
    <div>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 mb-8 shadow-xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/problems">
                <Button variant="outline" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
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
                  Share your mathematical creativity with the world. Design problems that challenge, educate, and inspire learners everywhere.
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
                        <p className="text-sm text-gray-600 mt-1">Start with the basics - title, description, and classification</p>
                      </div>
                    </div>
                    <Badge variant={steps[0].completed ? "default" : "outline"} className="px-3">
                      Step 1
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-8 space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-lg font-semibold text-gray-900 flex items-center gap-2">
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
                    <Label htmlFor="description" className="text-lg font-semibold text-gray-900">
                      Problem Description
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide context, background, and what students should know before attempting this problem..."
                      className="min-h-[120px] bg-white border-2 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
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
                      <span className="text-xs text-gray-400">
                        {description.length}/1000
                      </span>
                    </div>
                  </div>

                  {/* Category and Difficulty */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-gray-900">Category</Label>
                      <Select value={category} onValueChange={(value) => setCategory(value as ProblemCategory)}>
                        <SelectTrigger className="h-12 bg-white border-2 focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
                          <SelectValue placeholder="Choose a mathematics category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(PROBLEM_CATEGORIES).map(([key, cat]) => (
                            <SelectItem key={key} value={key} className="py-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg ${cat.color} flex items-center justify-center`}>
                                  <span className="text-white text-lg">{cat.icon}</span>
                                </div>
                                <div>
                                  <div className="font-medium">{cat.name}</div>
                                  <div className="text-xs text-gray-500">{cat.description}</div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
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
                      <Label className="text-lg font-semibold text-gray-900">Difficulty Level</Label>
                      <Select value={difficulty} onValueChange={(value) => setDifficulty(value as ProblemDifficulty)}>
                        <SelectTrigger className="h-12 bg-white border-2 focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
                          <SelectValue placeholder="Select difficulty level" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(PROBLEM_DIFFICULTIES).map(([key, diff]) => (
                            <SelectItem key={key} value={key} className="py-3">
                              <div className="flex items-center gap-3">
                                <div className="flex">
                                  {[...Array(diff.level)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                  ))}
                                  {[...Array(5 - diff.level)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-gray-300" />
                                  ))}
                                </div>
                                <div>
                                  <div className="font-medium">{diff.name}</div>
                                  <div className="text-xs text-gray-500">{diff.description}</div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
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
                        <p className="text-sm text-gray-600 mt-1">Write the actual problem and add relevant tags</p>
                      </div>
                    </div>
                    <Badge variant={steps[1].completed ? "default" : "outline"} className="px-3">
                      Step 2
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-lg font-semibold text-gray-900">
                      Problem Content
                    </Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write the mathematical problem here. Use LaTeX for formulas: $f(x) = x^2 + 2x + 1$"
                      className="min-h-[200px] font-mono bg-white border-2 focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all resize-none"
                    />
                    {errors.content && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm">{errors.content}</span>
                      </div>
                    )}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-blue-900 mb-1">LaTeX Examples:</p>
                          <div className="space-y-1 text-blue-700 font-mono">
                            <p>• Inline: $x^2 + y^2 = r^2$</p>
                            <p>• Display: $$\int_0^1 x^2 dx = \frac{'{1}{3}'}$$</p>
                            <p>• Fraction: $\frac{'{a}{b}'}$, Square root: $\sqrt{'{x}'}$</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live Preview */}
                  {content && (
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        Live Preview
                        <Eye className="w-4 h-4 text-blue-500" />
                      </Label>
                      <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/30">
                        <div className="text-lg">
                          <MathText>{content}</MathText>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold text-gray-900">Tags</Label>
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
                        disabled={!newTag.trim() || tags.includes(newTag.trim().toLowerCase()) || tags.length >= 10}
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
                            <Badge key={tag} variant="secondary" className="gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
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

              {/* Step 3: Enhancement (Hints & Solution) */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-purple-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Lightbulb className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-900">Enhance Learning</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">Add hints and solutions to help learners (optional)</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="px-3">
                      Step 3
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-8 space-y-8">
                  {/* Hints */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        Progressive Hints
                        <Zap className="w-4 h-4 text-purple-500" />
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addHint}
                        className="border-purple-200 text-purple-700 hover:bg-purple-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Hint
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {hints.map((hint, index) => (
                        <div key={index} className="group p-4 border-2 border-purple-100 rounded-xl hover:border-purple-200 transition-colors">
                          <div className="flex gap-4">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                  Hint #{index + 1}
                                </Badge>
                              </div>
                              <Textarea
                                value={hint}
                                onChange={(e) => updateHint(index, e.target.value)}
                                placeholder="Enter a helpful hint..."
                                className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-100 resize-none"
                                rows={3}
                              />
                              {hint && (
                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                  <div className="text-xs font-medium text-yellow-800 mb-1">Preview:</div>
                                  <div className="text-sm">
                                    <MathText>{hint}</MathText>
                                  </div>
                                </div>
                              )}
                            </div>
                            {hints.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => removeHint(index)}
                                className="self-start text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Solution */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      Official Solution
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </Label>
                    <Textarea
                      value={solution}
                      onChange={(e) => setSolution(e.target.value)}
                      placeholder="Provide a complete step-by-step solution..."
                      className="min-h-[150px] font-mono bg-white border-2 focus:border-green-400 focus:ring-4 focus:ring-green-100 resize-none"
                    />
                    {solution && (
                      <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
                        <div className="text-sm font-medium text-green-800 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Solution Preview
                        </div>
                        <div className="prose">
                          <MathText>{solution}</MathText>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Step 4: Publishing Options */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-amber-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <Globe className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-900">Publishing Options</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">Choose how to share your problem with the community</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="px-3">
                      Step 4
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Draft Option */}
                    <div className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                      !isPublished 
                        ? 'border-blue-400 bg-blue-50 ring-4 ring-blue-100' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`} onClick={() => setIsPublished(false)}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Lock className="w-5 h-5 text-gray-600" />
                          <span className="font-semibold text-gray-900">Save as Draft</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          !isPublished ? 'border-blue-400 bg-blue-400' : 'border-gray-300'
                        }`}></div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Keep your problem private while you perfect it. You can publish it later.
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Users className="w-3 h-3" />
                        Only visible to you
                      </div>
                    </div>

                    {/* Publish Option */}
                    <div className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                      isPublished 
                        ? 'border-green-400 bg-green-50 ring-4 ring-green-100' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`} onClick={() => setIsPublished(true)}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-gray-900">Publish Now</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          isPublished ? 'border-green-400 bg-green-400' : 'border-gray-300'
                        }`}></div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Share immediately with the community. Others can discover and solve your problem.
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <TrendingUp className="w-3 h-3" />
                        Public and discoverable
                      </div>
                    </div>
                  </div>

                  {!isPublished && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-blue-900 mb-1">Draft Mode Benefits</p>
                          <ul className="text-blue-700 space-y-1 text-xs">
                            <li>• Review and edit before sharing</li>
                            <li>• Test with friends first</li>
                            <li>• Perfect the difficulty level</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Submit Section */}
              <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-6 -mx-4 rounded-t-2xl shadow-lg">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/problems" className="sm:w-auto">
                    <Button type="button" variant="outline" className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50">
                      Cancel
                    </Button>
                  </Link>
                  
                  <Button
                    type="submit"
                    disabled={submitting}
                    className={`flex-1 h-12 text-lg font-semibold ${
                      isPublished 
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                    } shadow-lg hover:shadow-xl transition-all`}
                  >
                    {submitting ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        {isPublished ? <Globe className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                        {isPublished ? 'Publish Problem' : 'Save as Draft'}
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
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{title}</h3>
                      </div>
                    ) : (
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    )}
                    
                    <div className="flex gap-2">
                      {category ? (
                        <Badge variant="outline" className="bg-white/80">
                          {PROBLEM_CATEGORIES[category]?.name}
                        </Badge>
                      ) : (
                        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                      )}
                      {difficulty && (
                        <Badge variant="outline" className={`${PROBLEM_DIFFICULTIES[difficulty]?.color} border-current bg-white/80`}>
                          {PROBLEM_DIFFICULTIES[difficulty]?.name}
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
                          <Badge key={tag} variant="secondary" className="text-xs bg-blue-100 text-blue-700">
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

            {/* Enhanced Tips */}
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
                      <p className="text-blue-700">Be specific about what you're asking. Include all necessary information.</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-green-900 mb-1">Progressive Hints</p>
                      <p className="text-green-700">Start with gentle nudges, get more specific with each hint.</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-purple-900 mb-1">LaTeX Magic</p>
                      <p className="text-purple-700">Use LaTeX for beautiful math. Try $\frac{'{a}{b}'}$ or $\sqrt{'{x}'}$</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-amber-900 mb-1">Engaging Content</p>
                      <p className="text-amber-700">Add context or real-world applications to make it interesting.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}