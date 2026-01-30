import { promotionTypes } from '@/database/drizzle.schema';
import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';

export const promotions = pgTable('promotions', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  promotion_type: integer('promotion_type').references(() => promotionTypes.id),
  start_date: timestamp('start_date').notNull(),
  end_date: timestamp('end_date').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
  isActive: boolean('is_active').notNull().default(true),
});
