import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  // 👇 AQUÍ ESTÁ EL TRUCO:
  // Le decimos: "Usa POSTGRES_PRISMA_URL si existe (Vercel), si no, usa DATABASE_URL (Local)"
  // También probamos DATABASE_URL_PROD por si acaso la creaste manual.
  const url = process.env.DATABASE_URL_P || process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

  return new PrismaClient({
    datasources: {
      db: {
        url: url,
      },
    },
  });
};

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;