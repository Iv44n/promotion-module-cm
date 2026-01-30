import { Cart, AppliedDiscount } from '../../../interfaces';

export interface PromotionConditionInfo {
  conditionType: 'TARGET_CATEGORY' | 'MIN_AMOUNT';
  configuration: unknown;
}

export interface PromotionActionStrategy {
  readonly type: 'PERCENTAGE_DISCOUNT' | 'FIXED_DISCOUNT';

  apply(
    cart: Cart,
    config: unknown,
    promotionId: string,
    promotionName: string,
    conditions?: PromotionConditionInfo[],
  ): AppliedDiscount;
}

export const ACTION_STRATEGIES = 'ACTION_STRATEGIES';
