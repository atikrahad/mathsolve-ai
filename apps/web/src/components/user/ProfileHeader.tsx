'use client';

import { UserProfile, UserPublicProfile } from '@/services/userService';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Edit, Settings, User, UserPlus, UserMinus, Camera } from 'lucide-react';
import { useState } from 'react';

interface ProfileHeaderProps {
  profile: UserProfile | UserPublicProfile;
  isOwnProfile?: boolean;
  onEditProfile?: () => void;
  onEditAvatar?: () => void;
  onFollow?: () => void;
  onUnfollow?: () => void;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
}

export function ProfileHeader({
  profile,
  isOwnProfile = false,
  onEditProfile,
  onEditAvatar,
  onFollow,
  onUnfollow,
  onFollowersClick,
  onFollowingClick,
}: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(
    'isFollowing' in profile ? profile.isFollowing : false
  );

  const handleFollowClick = async () => {
    if (isFollowing) {
      await onUnfollow?.();
      setIsFollowing(false);
    } else {
      await onFollow?.();
      setIsFollowing(true);
    }
  };

  const getRankColor = (rank: string) => {
    const rankRate = rank?.toLowerCase();
    switch (rankRate) {
      case 'bronze':
        return 'bg-amber-600';
      case 'silver':
        return 'bg-gray-400';
      case 'gold':
        return 'bg-yellow-500';
      case 'platinum':
        return 'bg-cyan-500';
      case 'diamond':
        return 'bg-blue-500';
      case 'master':
        return 'bg-purple-600';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="relative">
      {/* Cover Background */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 relative">
        {/* Avatar */}
        <div className="absolute -bottom-12 left-8">
          <div className="relative group">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src={profile.profileImage || undefined} alt={profile.username} />
              <AvatarFallback className="bg-gray-200 text-2xl">
                {profile?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {isOwnProfile && onEditAvatar && (
              <button
                onClick={onEditAvatar}
                className="absolute inset-0 w-24 h-24 rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 right-8">
          {isOwnProfile ? (
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={onEditProfile}
                className="bg-white/90 hover:bg-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleFollowClick}
              variant={isFollowing ? 'secondary' : 'default'}
              size="sm"
              className={isFollowing ? 'bg-white/90 hover:bg-white' : ''}
            >
              {isFollowing ? (
                <>
                  <UserMinus className="w-4 h-4 mr-2" />
                  Unfollow
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Follow
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-16 p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-900">{profile.username}</h1>
              <Badge className={`${getRankColor(profile.currentRank)} text-white`}>
                {profile.currentRank}
              </Badge>
            </div>

            <div className="flex items-center text-gray-600 space-x-4">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span className="text-sm">
                  {'email' in profile ? profile.email : 'Public Profile'}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Joined {formatDate(profile.createdAt)}</span>
              </div>
            </div>

            {profile.bio && <p className="text-gray-700 max-w-2xl mt-3">{profile.bio}</p>}
          </div>

          {/* Stats Summary for Public Profiles */}
          {'followersCount' in profile && (
            <div className="flex space-x-6 text-center">
              <button
                onClick={onFollowersClick}
                className="hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                disabled={!onFollowersClick}
              >
                <div className="text-2xl font-bold text-gray-900">{profile.followersCount}</div>
                <div className="text-sm text-gray-600">Followers</div>
              </button>
              <button
                onClick={onFollowingClick}
                className="hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                disabled={!onFollowingClick}
              >
                <div className="text-2xl font-bold text-gray-900">{profile.followingCount}</div>
                <div className="text-sm text-gray-600">Following</div>
              </button>
              <div className="px-3 py-2">
                <div className="text-2xl font-bold text-gray-900">{profile.rankPoints}</div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
            </div>
          )}
        </div>

        {/* Streak and Points */}
        <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              <strong className="text-gray-900">{profile.streakCount}</strong> day streak
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              <strong className="text-gray-900">{profile.rankPoints}</strong> total points
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
