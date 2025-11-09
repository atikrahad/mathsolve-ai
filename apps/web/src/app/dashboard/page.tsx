'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Header from '@/components/layout/Header';
import { Trophy, Target, Calendar, BookOpen, Plus, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import problemService from '@/services/problemService';
import type { ProblemDifficulty } from '@/types/problem';


function DashboardContent() {
  const { user } = useAuthStore();

  const [categoryStats, setCategoryStats] = useState<Array<{ label: string; count: number; color: string }>>([]);
  const [difficultyStats, setDifficultyStats] = useState<Array<{ label: string; value: number; color: string }>>([]);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const palette = ['bg-emerald-400', 'bg-sky-400', 'bg-amber-400', 'bg-rose-400', 'bg-indigo-400', 'bg-teal-400'];
    const difficultyMeta: Record<ProblemDifficulty | string, { label: string; color: string }> = {
      HIGH: { label: 'Advanced', color: '#fb7185' },
      HARD: { label: 'Advanced', color: '#fb7185' },
      MEDIUM: { label: 'Intermediate', color: '#fbbf24' },
      NORMAL: { label: 'Intermediate', color: '#fbbf24' },
      LOW: { label: 'Beginner', color: '#34d399' },
      EASY: { label: 'Beginner', color: '#34d399' },
    };

    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const stats = await problemService.getDashboardStats();
        if (!isMounted) return;

        const categoryCounts = stats.categories.map((item, index) => ({
          label: item.category,
          count: item.count,
          color: palette[index % palette.length],
        }));

        const difficultyCounts = stats.difficulties.map((slice) => {
          const key = (slice.difficulty || '').toUpperCase();
          const meta = difficultyMeta[key] ?? { label: key || 'Unknown', color: '#6366f1' };
          return {
            label: meta.label,
            value: slice.count,
            color: meta.color,
          };
        });

        setCategoryStats(categoryCounts);
        setDifficultyStats(difficultyCounts);
      } catch (error) {
        console.error('Failed to load problem stats', error);
        if (isMounted) {
          setCategoryStats([]);
          setDifficultyStats([]);
        }
      } finally {
        if (isMounted) {
          setStatsLoading(false);
        }
      }
    };

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalProblems = useMemo(
    () => categoryStats.reduce((sum, item) => sum + item.count, 0),
    [categoryStats]
  );

  const difficultyTotal = useMemo(
    () => difficultyStats.reduce((sum, item) => sum + item.value, 0),
    [difficultyStats]
  );

  const difficultyGradient = useMemo(() => {
    if (!difficultyStats.length || !difficultyTotal) return '#e2e8f0';
    let cumulative = 0;
    return difficultyStats
      .map((slice) => {
        const start = (cumulative / difficultyTotal) * 360;
        cumulative += slice.value;
        const end = (cumulative / difficultyTotal) * 360;
        return `${slice.color} ${start}deg ${end}deg`;
      })
      .join(', ');
  }, [difficultyStats, difficultyTotal]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* User Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rank Points</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.rankPoints || 0}</div>
              <p className="text-xs text-muted-foreground">
                Current Rank: {user?.currentRank || 'Beginner'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.streakCount || 0}</div>
              <p className="text-xs text-muted-foreground">Days in a row</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Member Since</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
              </div>
              <p className="text-xs text-muted-foreground">Join date</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Problems
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/problems">
                <Button className="w-full" size="lg">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Browse Problems
                </Button>
              </Link>
              <Link href="/problems/create">
                <Button variant="outline" className="w-full" size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Problem
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Start</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/problems?difficulty=beginner">
                <Button className="w-full" size="lg">
                  <Target className="w-4 h-4 mr-2" />
                  Start Easy
                </Button>
              </Link>
              <Link href="/problems?sortBy=popularity&sortOrder=desc">
                <Button variant="outline" className="w-full" size="lg">
                  <Trophy className="w-4 h-4 mr-2" />
                  Popular Problems
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">No recent activity yet.</p>
              <p className="text-sm text-gray-500 mt-2">
                Start solving problems to see your activity here!
              </p>
              <Link href="/problems">
                <Button variant="outline" className="w-full mt-4">
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Problem Categories Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {statsLoading && !categoryStats.length ? (
                <p className="text-sm text-gray-500">Loading problem breakdown…</p>
              ) : categoryStats.length ? (
                categoryStats.map((type) => {
                  const percentage = totalProblems ? Math.round((type.count / totalProblems) * 100) : 0;
                  const width = totalProblems ? (type.count / totalProblems) * 100 : 0;
                  return (
                    <div key={type.label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">{type.label}</span>
                        <span className="text-gray-500">
                          {type.count} · {percentage}%
                        </span>
                      </div>
                      <div className="h-3 rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full ${type.color}`}
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">No problem stats available yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Difficulty Distribution</CardTitle>
            </CardHeader>
            <CardContent>
            {statsLoading && !difficultyStats.length ? (
                <p className="text-sm text-gray-500">Loading difficulty insights…</p>
              ) : difficultyStats.length ? (
                <div className="flex flex-col items-center gap-8">
                  <div className="relative w-64 h-64">
                    <div
                      className="w-full h-full rounded-full"
                      style={{ background: `conic-gradient(${difficultyGradient})` }}
                    />
                    <div className="absolute inset-8 rounded-full bg-white flex flex-col items-center justify-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Total Problems</p>
                      <p className="text-3xl font-semibold text-gray-900">{difficultyTotal}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {difficultyStats.map((slice) => {
                      const percentage = difficultyTotal ? Math.round((slice.value / difficultyTotal) * 100) : 0;
                      return (
                        <div key={slice.label} className="flex items-center gap-3 text-sm">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: slice.color }}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-700">{slice.label}</span>
                            <span className="text-gray-500 text-xs font-semibold">{percentage}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No difficulty data available yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Profile Info */}
        {user && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Username</label>
                  <p className="text-gray-900">{user.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">User ID</label>
                  <p className="text-gray-600 text-sm font-mono">{user.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Active</label>
                  <p className="text-gray-600">
                    {user.lastActiveAt ? new Date(user.lastActiveAt).toLocaleString() : 'Now'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
