import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const prisma =
  globalThis.__prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  });

// Ensure connection is closed properly
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma;
}

export default prisma;
