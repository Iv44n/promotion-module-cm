import {
  serial,
  text,
  timestamp,
  pgTable,
  boolean,
  pgEnum,
  uuid,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core';

import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const promotionConditionsTypesEnum = pgEnum(
  'promotion_conditions_types',
  ['TARGET_CATEGORY', 'MIN_AMOUNT'],
);

export const promotionActionsTypesEnum = pgEnum('promotion_actions_types', [
  'PERCENTAGE_DISCOUNT',
  'FIXED_DISCOUNT',
]);

export const promotionTypes = pgTable('type_promotions', {
  id: serial('id').primaryKey(),
  type: text('type').notNull().default('CUSTOM'),
  description: text('description').notNull(),
  action_type: promotionActionsTypesEnum('action_type').notNull(),
  condition_type: promotionConditionsTypesEnum('condition_type').notNull(),
});

export const promotions = pgTable('promotions', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  promotion_type: integer('promotion_type')
    .notNull()
    .references(() => promotionTypes.id),
  start_date: timestamp('start_date').notNull(),
  end_date: timestamp('end_date').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
  isActive: boolean('is_active').notNull().default(true),
});

export const promotionConditions = pgTable('promotion_conditions', {
  id: serial('id').primaryKey(),
  promotion_id: uuid('promotion_id')
    .notNull()
    .references(() => promotions.id),
  condition_type: promotionConditionsTypesEnum('condition_type').notNull(),
  configuration: jsonb('configuration').notNull(),
});

export const promotionActions = pgTable('promotion_actions', {
  id: serial('id').primaryKey(),
  promotion_id: uuid('promotion_id')
    .notNull()
    .references(() => promotions.id),
  action_type: promotionActionsTypesEnum('action_type').notNull(),
  configuration: jsonb('configuration').notNull(),
});

//select
export type PromotionActionSelect = InferSelectModel<typeof promotionActions>;
export type PromotionConditionSelect = InferSelectModel<
  typeof promotionConditions
>;
export type PromotionTypeSelect = InferSelectModel<typeof promotionTypes>;
export type PromotionSelect = InferSelectModel<typeof promotions>;

// insert
export type PromotionInsert = InferInsertModel<typeof promotions>;
export type PromotionConditionInsert = InferInsertModel<
  typeof promotionConditions
>;
export type PromotionActionInsert = InferInsertModel<typeof promotionActions>;
export type PromotionTypeInsert = InferInsertModel<typeof promotionTypes>;
