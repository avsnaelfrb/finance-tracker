import 'dotenv/config'
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/models/schema.ts',
  out: './drizzle',
  dialect: 'mysql', // MariaDB pakai dialek mysql
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});