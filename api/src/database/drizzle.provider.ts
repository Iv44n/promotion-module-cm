import { ConfigService } from '@nestjs/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

export const DRIZZLE_TOKEN = 'DRIZZLE_TOKEN';
const DATABASE_URL = 'DATABASE_URL';

export const DrizzleAsyncProvider = {
  provide: DRIZZLE_TOKEN,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const databaseUrl = config.get<string>(DATABASE_URL);

    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined');
    }

    const sql = neon(databaseUrl);
    const db = drizzle(sql);

    return db;
  },
};
