'use client';

import { UserStatistics } from '@/services/userService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Award, Zap, BookOpen, Brain, Calendar, Trophy } from 'lucide-react';

interface ProfileStatsProps {
  stats: UserStatistics;
}

export function ProfileStats({ stats }: ProfileStatsProps) {
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

  const formatPercentage = (value: number) => {
    return `${Math.round(value * 100)}%`;
  };

  return (
    <div className="p-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Statistics</h2>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Problems Solved</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.solvedProblems}</div>
            <p className="text-xs text-muted-foreground">of {stats.totalProblems} attempted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(stats.successRate)}</div>
            <p className="text-xs text-muted-foreground">Average performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Rank</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge className={`${getRankColor(stats.currentRank)} text-white`}>
                {stats.currentRank}
              </Badge>
              <div className="text-lg font-bold">{stats.rankPoints}</div>
            </div>
            <p className="text-xs text-muted-foreground">Total rank points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.streakCount}</div>
            <p className="text-xs text-muted-foreground">Days in a row</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hints Used</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHints}</div>
            <p className="text-xs text-muted-foreground">Total hints requested</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Category</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{stats.favoriteCategory}</div>
            <p className="text-xs text-muted-foreground">Most solved category</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attempts</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageAttempts?.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Per problem solved</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Weekly Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.weeklyActivity?.length > 0 ? (
            <div className="space-y-3">
              {stats.weeklyActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {new Date(activity.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div
                      className="bg-blue-200 h-2 rounded-full"
                      style={{
                        width: `${Math.max(20, activity.problemsSolved * 10)}px`,
                      }}
                    ></div>
                    <span className="text-sm font-medium">{activity.problemsSolved}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No activity data available</p>
              <p className="text-sm mt-1">Start solving problems to see your progress!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rank History */}
      {stats.rankHistory?.length > 1 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Rank Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.rankHistory.slice(-5).map((entry, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getRankColor(entry.rank)} text-white text-xs`}>
                      {entry.rank}
                    </Badge>
                    <span className="text-sm font-medium">{entry.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
