import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const dummyPrismaClient = {
  // Add dummy implementations of used Prisma methods
  user: {
    findUnique: () => Promise.resolve(null),
    findFirst: () => Promise.resolve(null),
    update: () => Promise.resolve(null),
  },
  promise: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    create: () => Promise.resolve(null),
    update: () => Promise.resolve(null),
  },
} as PrismaClient;

const prismaClientSingleton = () => {
  // During build time or when DATABASE_URL is not available, return dummy client
  if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
    return dummyPrismaClient;
  }

  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.NODE_ENV === 'production' 
          ? process.env.DATABASE_URL 
          : process.env.DIRECT_URL || process.env.DATABASE_URL,
      },
    },
  });
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
