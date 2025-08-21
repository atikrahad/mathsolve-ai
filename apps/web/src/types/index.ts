// Core types for MathSolve AI

export interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
  rankPoints: number;
  currentRank: string;
  streakCount: number;
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt?: Date;
}

export interface Problem {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  solution?: string;
  qualityScore: number;
  viewCount: number;
  attemptCount: number;
  createdAt: Date;
  updatedAt: Date;
  creator?: User;
}

export interface Solution {
  id: string;
  problemId: string;
  userId: string;
  answer: string;
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent?: number;
  hintsUsed: number;
  submittedAt: Date;
  problem?: Problem;
  user?: User;
}

export interface Resource {
  id: string;
  title: string;
  content: string;
  type: ResourceType;
  category: string;
  difficulty?: string;
  authorId: string;
  viewCount: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  author?: User;
}

export enum Difficulty {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum ResourceType {
  TUTORIAL = "TUTORIAL",
  GUIDE = "GUIDE",
  REFERENCE = "REFERENCE",
}

export interface Achievement {
  id: string;
  userId: string;
  type: string;
  name: string;
  description?: string;
  earnedAt: Date;
}

export interface Comment {
  id: string;
  problemId: string;
  userId: string;
  content: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  replies?: Comment[];
}