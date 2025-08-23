'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/auth';
import { userService, UserProfile, UserStatistics } from '@/services/userService';
import { ProfileHeader } from '@/components/user/ProfileHeader';
import { ProfileStats } from '@/components/user/ProfileStats';
import { ProfileEditModal } from '@/components/user/ProfileEditModal';
import { AvatarUploadModal } from '@/components/user/AvatarUploadModal';
import { FollowersFollowingModal } from '@/components/user/FollowersFollowingModal';
import Header from '@/components/layout/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
// import { Settings, Edit } from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated, setUser } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [followersModalOpen, setFollowersModalOpen] = useState(false);
  const [followingModalOpen, setFollowingModalOpen] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setError('Please log in to view your profile');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [profileData, statsData] = await Promise.all([
        userService.getProfile(),
        user?.id ? userService.getUserStats(user.id) : Promise.resolve(null),
      ]);

      setProfile(profileData);
      if (statsData) {
        setStats(statsData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleProfileUpdate = async (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    // Update auth store user data as well
    if (user) {
      setUser({
        ...user,
        username: updatedProfile.username,
        bio: updatedProfile.bio,
        profileImage: updatedProfile.profileImage,
      });
    }
    setShowEditModal(false);
  };

  const handleAvatarUpdate = async (avatarUrl: string) => {
    if (profile) {
      const updatedProfile = { ...profile, profileImage: avatarUrl };
      setProfile(updatedProfile);

      // Update auth store user data
      if (user) {
        setUser({
          ...user,
          profileImage: avatarUrl,
        });
      }
    }
    setShowAvatarModal(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
            <Button onClick={() => (window.location.href = '/auth/login')}>Go to Login</Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
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
                <div className="flex space-x-2">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-10" />
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
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={fetchUserData}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <ProfileHeader
            profile={profile}
            isOwnProfile={true}
            onEditProfile={() => setShowEditModal(true)}
            onEditAvatar={() => setShowAvatarModal(true)}
            onFollowersClick={() => setFollowersModalOpen(true)}
            onFollowingClick={() => setFollowingModalOpen(true)}
          />

          {/* Profile Stats */}
          {stats && <ProfileStats stats={stats} />}

          {/* Additional Profile Sections */}
          <div className="p-8 space-y-8">
            {/* Recent Activity */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
                <p>No recent activity to display.</p>
                <p className="text-sm mt-2">Start solving problems to see your activity here!</p>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Achievements</h3>
              <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
                <p>No achievements yet.</p>
                <p className="text-sm mt-2">Complete challenges to unlock achievements!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <ProfileEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          profile={profile}
          onProfileUpdate={handleProfileUpdate}
        />

        <AvatarUploadModal
          isOpen={showAvatarModal}
          onClose={() => setShowAvatarModal(false)}
          currentAvatar={profile.profileImage}
          onAvatarUpdate={handleAvatarUpdate}
        />

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
