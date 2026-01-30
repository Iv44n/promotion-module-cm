import { pgEnum } from 'drizzle-orm/pg-core';

export const promotionConditionsTypesEnum = pgEnum(
  'promotion_conditions_types',
  ['TARGET_CATEGORY', 'MIN_AMOUNT'],
);

export const promotionActionsTypesEnum = pgEnum('promotion_actions_types', [
  'PERCENTAGE_DISCOUNT',
  'FIXED_DISCOUNT',
]);

export type PromotionConditionType =
  (typeof promotionConditionsTypesEnum.enumValues)[number];

export type PromotionActionType =
  (typeof promotionActionsTypesEnum.enumValues)[number];
