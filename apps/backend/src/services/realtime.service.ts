import type { Challenge as Problem } from '@prisma/client';
import { getSocketInstance } from '../lib/socket';
import { logger } from '../config/logger';

type ProblemPayload = Pick<Problem, 'id' | 'title' | 'category' | 'difficulty' | 'createdAt' | 'updatedAt'>;

class RealtimeService {
  emitProblemCreated(problem: Problem) {
    this.safeEmit('problem:created', this.sanitizeProblem(problem));
  }

  emitProblemUpdated(problem: Problem) {
    this.safeEmit('problem:updated', this.sanitizeProblem(problem));
  }

  emitProblemDeleted(problemId: string) {
    this.safeEmit('problem:deleted', { id: problemId });
  }

  private sanitizeProblem(problem: Problem): ProblemPayload {
    return {
      id: problem.id,
      title: problem.title,
      category: problem.category,
      difficulty: problem.difficulty,
      createdAt: problem.createdAt,
      updatedAt: problem.updatedAt,
    };
  }

  private safeEmit(event: string, payload: unknown) {
    try {
      const io = getSocketInstance();
      io.emit(event, payload);
    } catch (error) {
      logger.error('Socket emission failed', { event, error });
    }
  }
}

export const realtimeService = new RealtimeService();
