import { pgTable, serial, uuid, jsonb } from 'drizzle-orm/pg-core';
import { promotions } from './promotion.entity';
import {
  promotionActionsTypesEnum,
  promotionConditionsTypesEnum,
} from './promotion-metadatas.entity';

export const promotionConditions = pgTable('promotion_conditions', {
  id: serial('id').primaryKey(),
  promotion_id: uuid('promotion_id')
    .notNull()
    .references(() => promotions.id, { onDelete: 'cascade' }),
  condition_type: promotionConditionsTypesEnum('condition_type').notNull(),
  configuration: jsonb('configuration').notNull(),
});

export const promotionActions = pgTable('promotion_actions', {
  id: serial('id').primaryKey(),
  promotion_id: uuid('promotion_id')
    .notNull()
    .references(() => promotions.id, { onDelete: 'cascade' }),
  action_type: promotionActionsTypesEnum('action_type').notNull(),
  configuration: jsonb('configuration').notNull(),
});
