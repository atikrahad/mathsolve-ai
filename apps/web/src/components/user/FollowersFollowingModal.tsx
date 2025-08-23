'use client';

import { useState, useEffect, useCallback } from 'react';
import { userService, UserPublicProfile, FollowersFollowingResult } from '@/services/userService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  UserMinus,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FollowersFollowingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  username: string;
  initialTab?: 'followers' | 'following';
}

export function FollowersFollowingModal({
  isOpen,
  onClose,
  userId,
  username,
  initialTab = 'followers',
}: FollowersFollowingModalProps) {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialTab);
  const [followersData, setFollowersData] = useState<FollowersFollowingResult | null>(null);
  const [followingData, setFollowingData] = useState<FollowersFollowingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [followersPage, setFollowersPage] = useState(1);
  const [followingPage, setFollowingPage] = useState(1);

  const pageSize = 20;

  const fetchFollowers = useCallback(
    async (page: number) => {
      setLoading(true);
      setError(null);
      try {
        const result = await userService.getFollowers(userId, {
          page,
          limit: pageSize,
        });
        setFollowersData(result);
        setFollowersPage(page);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch followers');
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const fetchFollowing = useCallback(
    async (page: number) => {
      setLoading(true);
      setError(null);
      try {
        const result = await userService.getFollowing(userId, {
          page,
          limit: pageSize,
        });
        setFollowingData(result);
        setFollowingPage(page);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch following');
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    if (isOpen) {
      if (activeTab === 'followers' && !followersData) {
        fetchFollowers(1);
      } else if (activeTab === 'following' && !followingData) {
        fetchFollowing(1);
      }
    }
  }, [isOpen, activeTab, followersData, followingData, fetchFollowers, fetchFollowing]);

  const handleTabChange = (tab: 'followers' | 'following') => {
    setActiveTab(tab);
    if (tab === 'followers' && !followersData) {
      fetchFollowers(1);
    } else if (tab === 'following' && !followingData) {
      fetchFollowing(1);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (activeTab === 'followers') {
      fetchFollowers(newPage);
    } else {
      fetchFollowing(newPage);
    }
  };

  const handleFollow = async (targetUserId: string) => {
    try {
      await userService.followUser(targetUserId);
      // Update the local data
      const updateUserInList = (users: UserPublicProfile[]) =>
        users.map((user) =>
          user.id === targetUserId
            ? { ...user, isFollowing: true, followersCount: user.followersCount + 1 }
            : user
        );

      if (followersData) {
        setFollowersData({
          ...followersData,
          users: updateUserInList(followersData.users),
        });
      }
      if (followingData) {
        setFollowingData({
          ...followingData,
          users: updateUserInList(followingData.users),
        });
      }
    } catch (err) {
      console.error('Failed to follow user:', err);
    }
  };

  const handleUnfollow = async (targetUserId: string) => {
    try {
      await userService.unfollowUser(targetUserId);
      // Update the local data
      const updateUserInList = (users: UserPublicProfile[]) =>
        users.map((user) =>
          user.id === targetUserId
            ? { ...user, isFollowing: false, followersCount: user.followersCount - 1 }
            : user
        );

      if (followersData) {
        setFollowersData({
          ...followersData,
          users: updateUserInList(followersData.users),
        });
      }
      if (followingData) {
        setFollowingData({
          ...followingData,
          users: updateUserInList(followingData.users),
        });
      }
    } catch (err) {
      console.error('Failed to unfollow user:', err);
    }
  };

  const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
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

  const filterUsers = (users: UserPublicProfile[]) => {
    if (!searchTerm) return users;
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.bio && user.bio.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const renderUserList = (data: FollowersFollowingResult | null) => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            onClick={() => (activeTab === 'followers' ? fetchFollowers(1) : fetchFollowing(1))}
          >
            Try Again
          </Button>
        </div>
      );
    }

    if (!data || data.users.length === 0) {
      return (
        <div className="text-center py-8">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} found</h3>
          <p className="text-gray-600">
            {activeTab === 'followers'
              ? `${username} doesn't have any followers yet.`
              : `${username} isn't following anyone yet.`}
          </p>
        </div>
      );
    }

    const filteredUsers = filterUsers(data.users);

    return (
      <>
        <div className="space-y-3 min-h-[300px]">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg"
            >
              <Link href={`/users/${user.id}`}>
                <Avatar className="w-12 h-12 hover:opacity-80 transition-opacity cursor-pointer">
                  <AvatarImage src={user.profileImage || undefined} alt={user.username} />
                  <AvatarFallback className="bg-gray-200">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Link
                    href={`/users/${user.id}`}
                    className="font-medium text-gray-900 hover:text-blue-600 transition-colors truncate"
                  >
                    {user.username}
                  </Link>
                  <Badge className={`${getRankColor(user.currentRank)} text-white text-xs`}>
                    {user.currentRank}
                  </Badge>
                </div>
                {user.bio && <p className="text-sm text-gray-600 truncate">{user.bio}</p>}
                <div className="text-xs text-gray-500">
                  {user.rankPoints} points • {user.followersCount} followers
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Link href={`/users/${user.id}`}>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </Link>
                {user.isFollowing ? (
                  <Button variant="outline" size="sm" onClick={() => handleUnfollow(user.id)}>
                    <UserMinus className="w-4 h-4 mr-1" />
                    Unfollow
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => handleFollow(user.id)}>
                    <UserPlus className="w-4 h-4 mr-1" />
                    Follow
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-center space-x-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handlePageChange((activeTab === 'followers' ? followersPage : followingPage) - 1)
              }
              disabled={
                loading || (activeTab === 'followers' ? followersPage <= 1 : followingPage <= 1)
              }
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <span className="text-sm text-gray-600">
              Page {activeTab === 'followers' ? followersPage : followingPage} of{' '}
              {data.pagination.totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handlePageChange((activeTab === 'followers' ? followersPage : followingPage) + 1)
              }
              disabled={
                loading ||
                (activeTab === 'followers'
                  ? followersPage >= data.pagination.totalPages
                  : followingPage >= data.pagination.totalPages)
              }
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </>
    );
  };

  const currentData = activeTab === 'followers' ? followersData : followingData;
  const currentCount = currentData?.pagination.total || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {username}&apos;s {activeTab === 'followers' ? 'Followers' : 'Following'}
          </DialogTitle>
          <DialogDescription>
            {currentCount} {activeTab === 'followers' ? 'followers' : 'following'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(value) => handleTabChange(value as 'followers' | 'following')}
            className="flex-1 flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="followers">
                Followers ({followersData?.pagination.total || '...'})
              </TabsTrigger>
              <TabsTrigger value="following">
                Following ({followingData?.pagination.total || '...'})
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="followers" className="mt-4">
                {renderUserList(followersData)}
              </TabsContent>
              <TabsContent value="following" className="mt-4">
                {renderUserList(followingData)}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
