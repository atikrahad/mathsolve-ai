'use client';

import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Header from '@/components/layout/Header';
import { Trophy, Target, Calendar, BookOpen, Plus, TrendingUp } from 'lucide-react';
import Link from 'next/link';

function DashboardContent() {
  const { user } = useAuthStore();

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
