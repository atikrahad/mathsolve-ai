// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Eye,
  Star,
  Bookmark,
  Check,
  Share2,
  Edit,
  Calendar,
  User,
  Tag,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { MathRenderer } from '@/components/ui/math-renderer';
import resourceService from '@/services/resourceService';
import { useAuthStore } from '@/store/auth';
import {
  Resource,
  getResourceTypeIcon,
  getDifficultyInfo,
  formatResourceType,
} from '@/types/resource';

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const resourceId = params.id as string;

  const [resource, setResource] = useState<Resource | null>(null);
  const [relatedResources, setRelatedResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  // Fetch resource details
  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        setError(null);

        const resourceData = await resourceService.getResourceById(resourceId);
        setResource(resourceData);
        setIsBookmarked(resourceData.isBookmarked || false);

        // Fetch related resources
        if (resourceData.category) {
          const related = await resourceService.getRelatedResources(
            resourceId,
            resourceData.category,
            4
          );
          setRelatedResources(related);
        }
      } catch (err) {
        setError('Failed to load resource. Please try again.');
        console.error('Error fetching resource:', err);
      } finally {
        setLoading(false);
      }
    };

    if (resourceId) {
      fetchResource();
    }
  }, [resourceId]);

  // Handle bookmark toggle
  const handleBookmarkToggle = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    try {
      setBookmarkLoading(true);

      if (isBookmarked) {
        await resourceService.removeBookmark(resourceId);
        setIsBookmarked(false);
      } else {
        await resourceService.bookmarkResource(resourceId);
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    } finally {
      setBookmarkLoading(false);
    }
  };

  // Handle share
  const handleShare = async () => {
    const url = window.location.href;
    const title = resource?.title || 'Learning Resource';

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
          text: `Check out this ${resource?.type.toLowerCase()}: ${title}`,
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(url);
      // You could show a toast notification here
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return <ResourceDetailSkeleton />;
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="max-w-md mx-auto">
            <div className="flex items-center justify-between">
              <span>{error || 'Resource not found'}</span>
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          </Alert>
        </div>
      </div>
    );
  }

  const difficultyInfo = getDifficultyInfo(resource.difficulty);
  const typeIcon = getResourceTypeIcon(resource.type);
  const formattedDate = new Date(resource.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" className="mb-4" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Resources
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{typeIcon}</span>
                <Badge variant="outline" className="text-sm">
                  {formatResourceType(resource.type)}
                </Badge>
                {resource.difficulty && (
                  <Badge className={difficultyInfo.color}>{difficultyInfo.label}</Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {resource.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <Link
                    href={`/users/${resource.author.id}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {resource.author.username}
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formattedDate}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{resource.viewCount} views</span>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span>{resource.rating.toFixed(1)} rating</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <Tag className="w-4 h-4 text-gray-500" />
                <Badge variant="secondary">{resource.category}</Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 lg:min-w-[160px]">
              <Button
                onClick={handleBookmarkToggle}
                disabled={bookmarkLoading}
                variant={isBookmarked ? 'default' : 'outline'}
                className={isBookmarked ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
              >
                {isBookmarked ? (
                  <Check className="w-4 h-4 mr-2" />
                ) : (
                  <Bookmark className="w-4 h-4 mr-2" />
                )}
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>

              <Button variant="outline" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>

              {user?.id === resource.authorId && (
                <Link href={`/resources/${resource.id}/edit`}>
                  <Button variant="outline" className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Content */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm mb-8">
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              <MathRenderer content={resource.content} />
            </div>
          </CardContent>
        </Card>

        {/* Author Information */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                {resource.author.profileImage ? (
                  <img src={resource.author.profileImage} alt={resource.author.username} />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {resource.author.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">About the Author</h3>
                <Link
                  href={`/users/${resource.author.id}`}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  @{resource.author.username}
                </Link>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Member since {formattedDate}</span>
              </div>
              <Link href={`/resources?authorId=${resource.author.id}`}>
                <Button variant="link" className="h-auto p-0 text-blue-600">
                  View all resources by this author
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Related Resources */}
        {relatedResources.length > 0 && (
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Related Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedResources.map((relatedResource) => (
                  <RelatedResourceCard key={relatedResource.id} resource={relatedResource} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Related Resource Card Component
function RelatedResourceCard({ resource }: { resource: Resource }) {
  const typeIcon = getResourceTypeIcon(resource.type);
  const difficultyInfo = getDifficultyInfo(resource.difficulty);

  return (
    <Link href={`/resources/${resource.id}`}>
      <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <span className="text-lg">{typeIcon}</span>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                {resource.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {resource.type}
                </Badge>
                {resource.difficulty && (
                  <Badge className={`text-xs ${difficultyInfo.color}`}>
                    {difficultyInfo.label}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {resourceService.getResourceSummary(resource.content, 80)}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>{resource.viewCount} views</span>
                <span>⭐ {resource.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Loading Skeleton Component
function ResourceDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-10 w-32 mb-4" />

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-12 w-3/4 mb-4" />
            <div className="flex gap-6 mb-6">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
