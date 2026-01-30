import { serial, text, pgTable, pgEnum } from 'drizzle-orm/pg-core';

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

export type PromotionConditionType =
  (typeof promotionConditionsTypesEnum.enumValues)[number];

export type PromotionActionType =
  (typeof promotionActionsTypesEnum.enumValues)[number];

export * from '@/modules/promotions/entities/promotion.entity';
export * from '@/modules/promotions/entities/promotion-rules.entity';
