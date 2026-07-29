import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL no está definida en el .env');
}

const databaseUrl: string = process.env.DATABASE_URL;

const dbUrl = new URL(databaseUrl);

const adapter = new PrismaMariaDb({
  host: dbUrl.hostname || '127.0.0.1',
  port: dbUrl.port ? Number(dbUrl.port) : 3306,
  user: dbUrl.username || 'root',
  password: dbUrl.password,
  database: dbUrl.pathname.replace('/', ''),
  connectionLimit: 5,
});


export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    adapter,
    log: ['query', 'info', 'warn', 'error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 