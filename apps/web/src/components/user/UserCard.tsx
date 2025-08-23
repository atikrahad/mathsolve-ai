'use client';

import { UserPublicProfile } from '@/services/userService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, Trophy, Zap } from 'lucide-react';
import Link from 'next/link';

interface UserCardProps {
  user: UserPublicProfile;
}

export function UserCard({ user }: UserCardProps) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <Link href={`/users/${user.id}`}>
            <Avatar className="w-16 h-16 hover:opacity-80 transition-opacity cursor-pointer">
              <AvatarImage src={user.profileImage || undefined} alt={user.username} />
              <AvatarFallback className="bg-gray-200 text-lg">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <Link
                href={`/users/${user.id}`}
                className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate"
              >
                {user.username}
              </Link>
              <Badge className={`${getRankColor(user.currentRank)} text-white`}>
                {user.currentRank}
              </Badge>
            </div>

            {user.bio && <p className="text-gray-600 text-sm mb-3 line-clamp-2">{user.bio}</p>}

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {formatDate(user.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{user.followersCount} followers</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="flex items-center space-x-1 text-blue-600">
                  <Trophy className="w-4 h-4" />
                  <span className="font-semibold">{user.rankPoints}</span>
                </div>
                <div className="text-xs text-gray-500">Points</div>
              </div>

              <div className="text-center">
                <div className="flex items-center space-x-1 text-orange-600">
                  <Zap className="w-4 h-4" />
                  <span className="font-semibold">{user.streakCount}</span>
                </div>
                <div className="text-xs text-gray-500">Streak</div>
              </div>
            </div>

            <Link href={`/users/${user.id}`}>
              <Button variant="outline" size="sm">
                View Profile
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
