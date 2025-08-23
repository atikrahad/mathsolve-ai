import { User, Prisma } from '@prisma/client';
import { AbstractRepository, FindManyOptions } from './base.repository';

export interface UserCreateInput {
  username: string;
  email: string;
  passwordHash: string;
  profileImage?: string;
  bio?: string;
  provider?: string;
  providerId?: string;
}

export interface UserUpdateInput {
  username?: string;
  email?: string;
  passwordHash?: string;
  profileImage?: string;
  bio?: string;
  isEmailVerified?: boolean;
  lastActiveAt?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
}

export interface UserSearchOptions extends FindManyOptions {
  searchTerm?: string;
  isEmailVerified?: boolean;
  provider?: string;
}

export class UserRepository extends AbstractRepository<User> {
  protected model = this.prisma.user;

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.model.findUnique({
      where: { email }
    });
  }

  /**
   * Find user by username
   */
  async findByUsername(username: string): Promise<User | null> {
    return await this.model.findUnique({
      where: { username }
    });
  }

  /**
   * Find user by provider and provider ID
   */
  async findByProvider(provider: string, providerId: string): Promise<User | null> {
    return await this.model.findFirst({
      where: {
        provider,
        providerId
      }
    });
  }

  /**
   * Find user by reset password token
   */
  async findByResetToken(token: string): Promise<User | null> {
    return await this.model.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date()
        }
      }
    });
  }

  /**
   * Find user by email verification token
   */
  async findByEmailVerificationToken(token: string): Promise<User | null> {
    return await this.model.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: {
          gt: new Date()
        }
      }
    });
  }

  /**
   * Create user with specific input type
   */
  async createUser(data: UserCreateInput): Promise<User> {
    return await this.model.create({
      data: {
        ...data,
        rankPoints: 0,
        currentRank: 'Bronze',
        streakCount: 0,
        lastActiveAt: new Date()
      }
    });
  }

  /**
   * Update user with specific input type
   */
  async updateUser(id: string, data: UserUpdateInput): Promise<User> {
    return await this.model.update({
      where: { id },
      data
    });
  }

  /**
   * Search users with advanced options
   */
  async searchUsers(options: UserSearchOptions): Promise<User[]> {
    const {
      searchTerm,
      isEmailVerified,
      provider,
      skip,
      take,
      orderBy = { createdAt: 'desc' }
    } = options;

    const where: Prisma.UserWhereInput = {};

    if (searchTerm) {
      where.OR = [
        { username: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } }
      ];
    }

    if (isEmailVerified !== undefined) {
      where.isEmailVerified = isEmailVerified;
    }

    if (provider) {
      where.provider = provider;
    }

    return await this.model.findMany({
      where,
      skip,
      take,
      orderBy,
      select: {
        id: true,
        username: true,
        email: true,
        profileImage: true,
        bio: true,
        rankPoints: true,
        currentRank: true,
        streakCount: true,
        isEmailVerified: true,
        provider: true,
        createdAt: true,
        lastActiveAt: true
      }
    });
  }

  /**
   * Update user's last active timestamp
   */
  async updateLastActive(id: string): Promise<void> {
    await this.model.update({
      where: { id },
      data: { lastActiveAt: new Date() }
    });
  }

  /**
   * Increment user's rank points
   */
  async incrementRankPoints(id: string, points: number): Promise<User> {
    return await this.model.update({
      where: { id },
      data: {
        rankPoints: {
          increment: points
        },
        lastActiveAt: new Date()
      }
    });
  }

  /**
   * Update user's streak count
   */
  async updateStreakCount(id: string, count: number): Promise<User> {
    return await this.model.update({
      where: { id },
      data: {
        streakCount: count,
        lastActiveAt: new Date()
      }
    });
  }

  /**
   * Get users by rank range
   */
  async getUsersByRankRange(minPoints: number, maxPoints: number): Promise<User[]> {
    return await this.model.findMany({
      where: {
        rankPoints: {
          gte: minPoints,
          lte: maxPoints
        }
      },
      orderBy: {
        rankPoints: 'desc'
      }
    });
  }

  /**
   * Get top users by rank points
   */
  async getTopUsers(limit: number = 10): Promise<User[]> {
    return await this.model.findMany({
      take: limit,
      orderBy: {
        rankPoints: 'desc'
      },
      select: {
        id: true,
        username: true,
        profileImage: true,
        rankPoints: true,
        currentRank: true,
        streakCount: true
      }
    });
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    const where: Prisma.UserWhereInput = { email };
    
    if (excludeId) {
      where.id = { not: excludeId };
    }

    const count = await this.model.count({ where });
    return count > 0;
  }

  /**
   * Check if username exists
   */
  async usernameExists(username: string, excludeId?: string): Promise<boolean> {
    const where: Prisma.UserWhereInput = { username };
    
    if (excludeId) {
      where.id = { not: excludeId };
    }

    const count = await this.model.count({ where });
    return count > 0;
  }
}