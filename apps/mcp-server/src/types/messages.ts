// MCP Message Types and Interfaces

export interface MCPMessage {
  id: string;
  type: string;
  timestamp: string;
  data: any;
}

export interface MCPResponse {
  id: string;
  type: string;
  timestamp: string;
  data?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// Authentication Messages
export interface AuthenticateMessage extends MCPMessage {
  type: 'authenticate';
  data: {
    userId: string;
    token: string;
  };
}

export interface AuthenticatedResponse extends MCPResponse {
  type: 'authenticated';
  data: {
    success: boolean;
    userId: string;
    message: string;
  };
}

// Skill Analysis Messages
export interface AnalyzeSkillMessage extends MCPMessage {
  type: 'analyze-skill';
  data: {
    userId: string;
    recentProblems?: string[];
    timeRange?: string;
  };
}

export interface SkillAnalysisResponse extends MCPResponse {
  type: 'skill-analysis';
  data: {
    userId: string;
    skillLevel: string;
    strengths: string[];
    weaknesses: string[];
    recommendedDifficulty: string;
    confidence: number;
  };
}

// Recommendation Messages
export interface GetRecommendationsMessage extends MCPMessage {
  type: 'get-recommendations';
  data: {
    userId: string;
    category?: string;
    difficulty?: string;
    limit?: number;
  };
}

export interface RecommendationsResponse extends MCPResponse {
  type: 'recommendations';
  data: {
    userId: string;
    problems: RecommendedProblem[];
    resources: RecommendedResource[];
    learningPaths: LearningPath[];
  };
}

// Problem Matching Messages
export interface MatchProblemsMessage extends MCPMessage {
  type: 'match-problems';
  data: {
    query: string;
    category?: string;
    difficulty?: string;
    limit?: number;
  };
}

export interface ProblemMatchesResponse extends MCPResponse {
  type: 'problem-matches';
  data: {
    query: string;
    matches: ProblemMatch[];
    totalFound: number;
  };
}

// Data Types
export interface RecommendedProblem {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  estimatedTime: number;
  relevanceScore: number;
  reason: string;
}

export interface RecommendedResource {
  id: string;
  title: string;
  type: string;
  category: string;
  relevanceScore: number;
  reason: string;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  estimatedDuration: string;
  steps: LearningStep[];
}

export interface LearningStep {
  id: string;
  title: string;
  type: 'problem' | 'resource' | 'assessment';
  resourceId: string;
  order: number;
  isCompleted: boolean;
}

export interface ProblemMatch {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  similarityScore: number;
  matchedConcepts: string[];
}

// Utility types
export interface MCPError {
  code: string;
  message: string;
  details?: any;
}

export type MessageType = 
  | 'authenticate'
  | 'analyze-skill'
  | 'get-recommendations'
  | 'match-problems'
  | 'ping'
  | 'pong'
  | 'error'
  | 'authenticated'
  | 'skill-analysis'
  | 'recommendations'
  | 'problem-matches';