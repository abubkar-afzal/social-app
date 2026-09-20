import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(process.cwd(), '.env.local') });

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;