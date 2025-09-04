'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, HelpCircle, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import resourceService from '@/services/resourceService';
import { useAuthStore } from '@/store/auth';
import {
  CreateResourceData,
  ResourceType,
  DifficultyLevel,
  RESOURCE_CATEGORIES,
  RESOURCE_TYPES,
  DIFFICULTY_LEVELS,
  getResourceTypeIcon,
} from '@/types/resource';

export default function CreateResourcePage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState<CreateResourceData>({
    title: '',
    content: '',
    type: 'TUTORIAL',
    category: 'Algebra',
    difficulty: 'LOW',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/resources/create');
    }
  }, [user, router]);

  // Handle form input changes
  const handleInputChange = (field: keyof CreateResourceData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push('/auth/login');
      return;
    }

    try {
      setLoading(true);
      setErrors([]);
      setSuccess(false);

      // Validate form data
      const validationErrors = resourceService.validateResourceData(formData);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      // Create resource
      const resource = await resourceService.createResource(formData);

      setSuccess(true);

      // Redirect to the created resource after a short delay
      setTimeout(() => {
        router.push(`/resources/${resource.id}`);
      }, 1500);
    } catch (err: any) {
      console.error('Error creating resource:', err);
      setErrors([err.response?.data?.message || 'Failed to create resource. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <Alert>
              <div className="flex items-center justify-between">
                <span>Please log in to create a resource</span>
                <Link href="/auth/login">
                  <Button size="sm">Log In</Button>
                </Link>
              </div>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Resource Created Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                Your learning resource has been created and is now available to the community.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => router.push('/resources')}>
                  Browse Resources
                </Button>
                <Button onClick={() => router.push('/resources/create')}>Create Another</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/resources">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Resources
            </Button>
          </Link>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Learning Resource
          </h1>
          <p className="text-gray-600 mt-2">
            Share your knowledge with the community by creating a tutorial, guide, or reference
            material
          </p>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <Alert variant="destructive" className="mb-8">
            <div>
              <h4 className="font-medium mb-2">Please fix the following errors:</h4>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Resource Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Title */}
                  <div>
                    <Label htmlFor="title" className="text-base font-medium">
                      Title *
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter a clear, descriptive title..."
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="mt-2"
                      maxLength={200}
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      {formData.title.length}/200 characters
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <Label className="text-base font-medium">Content *</Label>
                    <div className="mt-2">
                      <Textarea
                        value={formData.content}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                        placeholder="Write your content here... You can use Markdown and LaTeX math expressions."
                        className="min-h-[300px]"
                        maxLength={50000}
                      />
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {formData.content.length}/50,000 characters
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Resource Settings */}
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Resource Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Type */}
                  <div>
                    <Label htmlFor="type" className="text-base font-medium">
                      Type *
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleInputChange('type', value as ResourceType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {RESOURCE_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {getResourceTypeIcon(type.value)} {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 mt-1">
                      {RESOURCE_TYPES.find((t) => t.value === formData.type)?.description}
                    </p>
                  </div>

                  {/* Category */}
                  <div>
                    <Label htmlFor="category" className="text-base font-medium">
                      Category *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {RESOURCE_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <Label htmlFor="difficulty" className="text-base font-medium">
                      Difficulty Level
                    </Label>
                    <Select
                      value={formData.difficulty || ''}
                      onValueChange={(value) =>
                        handleInputChange('difficulty', (value as DifficultyLevel) || null)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unspecified">Not specified</SelectItem>
                        {DIFFICULTY_LEVELS.map((difficulty) => (
                          <SelectItem key={difficulty.value} value={difficulty.value}>
                            {difficulty.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.difficulty && (
                      <div className="mt-2">
                        <Badge
                          className={
                            DIFFICULTY_LEVELS.find((d) => d.value === formData.difficulty)?.color
                          }
                        >
                          {DIFFICULTY_LEVELS.find((d) => d.value === formData.difficulty)?.label}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Help */}
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    Writing Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                  <div>
                    <h4 className="font-medium">For Tutorials:</h4>
                    <p className="text-gray-600">
                      Include step-by-step instructions with examples and practice problems.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">For Guides:</h4>
                    <p className="text-gray-600">
                      Provide comprehensive coverage of a topic with clear explanations and context.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">For Reference:</h4>
                    <p className="text-gray-600">
                      Focus on formulas, definitions, and quick lookup information.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={loading || !formData.title || !formData.content}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {loading ? (
                    <>Creating...</>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Resource
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/resources')}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
