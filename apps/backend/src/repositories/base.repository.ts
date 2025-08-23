import { PrismaClient } from '@prisma/client';
import prisma from '../config/database';

export interface BaseRepository<T> {
  findById(id: string): Promise<T | null>;
  findMany(options?: FindManyOptions): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

export interface FindManyOptions {
  skip?: number;
  take?: number;
  where?: any;
  orderBy?: any;
  include?: any;
  select?: any;
}

export abstract class AbstractRepository<T> implements BaseRepository<T> {
  protected prisma: PrismaClient;
  protected abstract model: any;

  constructor() {
    this.prisma = prisma;
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findUnique({
      where: { id },
    });
  }

  async findMany(options?: FindManyOptions): Promise<T[]> {
    return await this.model.findMany(options);
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create({
      data,
    });
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    return await this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.model.delete({
      where: { id },
    });
  }

  async count(where?: any): Promise<number> {
    return await this.model.count({ where });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.model.count({
      where: { id },
    });
    return count > 0;
  }
}
