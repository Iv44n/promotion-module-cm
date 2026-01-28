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
  type: text('type').notNull(),
  description: text('description').notNull(),
  action_type: promotionActionsTypesEnum('action_type').notNull(),
  condition_type: promotionConditionsTypesEnum('condition_type').notNull(),
});

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
