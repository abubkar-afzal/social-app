import { defineConfig } from 'prisma/config';
import 'dotenv/config';  // <-- load .env

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
});