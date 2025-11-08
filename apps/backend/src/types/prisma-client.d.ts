declare module '@prisma/client' {
  export namespace Prisma {
    export type PrismaPromise<T> = Promise<T>;
    export type PrismaClientOptions = Record<string, any>;
    export type ChallengeWhereInput = Record<string, any>;
    export type ChallengeOrderByWithRelationInput = Record<string, any>;
    export type ResourceWhereInput = Record<string, any>;
    export type ResourceOrderByWithRelationInput = Record<string, any>;
    export type UserWhereInput = Record<string, any>;
    export class PrismaClientKnownRequestError extends Error {
      code: string;
      meta?: Record<string, any>;
    }
  }

  export interface PrismaClient {
    [key: string]: any;
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    $on(event: string, callback: (...args: any[]) => void): void;
  }

  export const PrismaClient: {
    new (options?: Prisma.PrismaClientOptions): PrismaClient;
  };

  export type User = {
    id: string;
    email: string;
    username: string;
    [key: string]: any;
  };
  export type Challenge = Record<string, any>;
  export type ChallengeRating = Record<string, any>;
  export type Submission = Record<string, any>;
  export type Resource = Record<string, any>;
  export type Bookmark = Record<string, any>;
}
