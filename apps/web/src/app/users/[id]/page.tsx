'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { userService, UserPublicProfile, UserStatistics } from '@/services/userService';
import { ProfileHeader } from '@/components/user/ProfileHeader';
import { ProfileStats } from '@/components/user/ProfileStats';
import { FollowersFollowingModal } from '@/components/user/FollowersFollowingModal';
import Header from '@/components/layout/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const { user: currentUser, isAuthenticated } = useAuthStore();

  const [profile, setProfile] = useState<UserPublicProfile | null>(null);
  const [stats, setStats] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followersModalOpen, setFollowersModalOpen] = useState(false);
  const [followingModalOpen, setFollowingModalOpen] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const [profileData, statsData] = await Promise.all([
        userService.getUserById(userId),
        userService.getUserStats(userId),
      ]);

      setProfile(profileData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleFollow = async () => {
    if (!profile || !isAuthenticated) return;

    try {
      await userService.followUser(profile.id);
      setProfile({
        ...profile,
        isFollowing: true,
        followersCount: profile.followersCount + 1,
      });
    } catch (err) {
      console.error('Failed to follow user:', err);
    }
  };

  const handleUnfollow = async () => {
    if (!profile || !isAuthenticated) return;

    try {
      await userService.unfollowUser(profile.id);
      setProfile({
        ...profile,
        isFollowing: false,
        followersCount: profile.followersCount - 1,
      });
    } catch (err) {
      console.error('Failed to unfollow user:', err);
    }
  };

  // Check if this is the current user's own profile
  const isOwnProfile = currentUser?.id === userId;

  // Redirect to own profile page if viewing own profile
  useEffect(() => {
    if (isOwnProfile) {
      window.location.href = '/profile';
    }
  }, [isOwnProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/users">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Users
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header Skeleton */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 relative">
              <div className="absolute -bottom-12 left-8">
                <Skeleton className="w-24 h-24 rounded-full border-4 border-white" />
              </div>
            </div>

            <div className="pt-16 p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex space-x-6 text-center">
                  <div>
                    <Skeleton className="h-8 w-16 mb-1" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div>
                    <Skeleton className="h-8 w-16 mb-1" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div>
                    <Skeleton className="h-8 w-16 mb-1" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>

              {/* Stats Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-6">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-8 w-16 mb-4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-6">
            <Link href="/users">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Users
              </Button>
            </Link>
          </div>

          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="space-x-4">
                <Button onClick={fetchUserData}>Try Again</Button>
                <Link href="/users">
                  <Button variant="outline">Back to Users</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-6">
            <Link href="/users">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Users
              </Button>
            </Link>
          </div>

          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
              <p className="text-gray-600 mb-6">
                The user you&apos;re looking for doesn&apos;t exist.
              </p>
              <Link href="/users">
                <Button>Back to Users</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <ProfileHeader
            profile={profile}
            isOwnProfile={false}
            onFollow={handleFollow}
            onUnfollow={handleUnfollow}
          />

          {/* Follow Stats - Clickable */}
          <div className="px-8 py-4 border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setFollowersModalOpen(true)}
                className="text-center hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
              >
                <div className="text-2xl font-bold text-gray-900">{profile.followersCount}</div>
                <div className="text-sm text-gray-600">Followers</div>
              </button>
              <button
                onClick={() => setFollowingModalOpen(true)}
                className="text-center hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
              >
                <div className="text-2xl font-bold text-gray-900">{profile.followingCount}</div>
                <div className="text-sm text-gray-600">Following</div>
              </button>
            </div>
          </div>

          {/* Profile Stats */}
          {stats && <ProfileStats stats={stats} />}

          {/* Additional Profile Sections */}
          <div className="p-8 space-y-8">
            {/* Recent Activity */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
                <p>Recent activity is private.</p>
                <p className="text-sm mt-2">Only visible to the profile owner.</p>
              </div>
            </div>

            {/* Public Achievements */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Achievements</h3>
              <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
                <p>No public achievements to display.</p>
                <p className="text-sm mt-2">Achievements will appear here when earned!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <FollowersFollowingModal
          isOpen={followersModalOpen}
          onClose={() => setFollowersModalOpen(false)}
          userId={profile.id}
          username={profile.username}
          initialTab="followers"
        />

        <FollowersFollowingModal
          isOpen={followingModalOpen}
          onClose={() => setFollowingModalOpen(false)}
          userId={profile.id}
          username={profile.username}
          initialTab="following"
        />
      </div>
    </div>
  );
}
