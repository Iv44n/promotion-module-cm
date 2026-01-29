import { Cart, AppliedDiscount } from '../../../interfaces';

export interface PromotionActionStrategy {
  readonly type: 'PERCENTAGE_DISCOUNT' | 'FIXED_DISCOUNT';

  apply(
    cart: Cart,
    config: unknown,
    promotionId: string,
    promotionName: string,
  ): AppliedDiscount;
}

export const ACTION_STRATEGIES = 'ACTION_STRATEGIES';
