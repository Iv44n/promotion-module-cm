import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

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

    const pool = new Pool({ connectionString: databaseUrl });
    const db = drizzle(pool);

    return db;
  },
};
