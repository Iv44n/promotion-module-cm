import {
  promotionActionsTypesEnum,
  promotionConditionsTypesEnum,
} from '@/modules/promotions/entities/promotion-metadatas.entity';
import { serial, text, pgTable } from 'drizzle-orm/pg-core';

export const promotionTypes = pgTable('type_promotions', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(),
  description: text('description').notNull(),
  action_type: promotionActionsTypesEnum('action_type').notNull(),
  condition_type: promotionConditionsTypesEnum('condition_type').notNull(),
});

export * from '@/modules/promotions/entities/promotion-metadatas.entity';
export * from '@/modules/promotions/entities/promotion.entity';
export * from '@/modules/promotions/entities/promotion-rules.entity';
