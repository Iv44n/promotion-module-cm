import { Injectable } from '@nestjs/common';
import { PromotionActionStrategy } from './action-strategy.interface';
import {
  Cart,
  AppliedDiscount,
  FixedDiscountConfig,
} from '../../../interfaces';

@Injectable()
export class FixedDiscountStrategy implements PromotionActionStrategy {
  readonly type = 'FIXED_DISCOUNT' as const;

  apply(
    cart: Cart,
    config: unknown,
    promotionId: string,
    promotionName: string,
  ): AppliedDiscount {
    const { discountFixed } = config as FixedDiscountConfig;

    const discountAmount = Math.min(discountFixed || 0, cart.subtotal);

    return {
      promotionId,
      promotionName,
      discountType: 'FIXED_DISCOUNT',
      discountAmount: Math.round(discountAmount * 100) / 100,
      description: `$${discountAmount.toFixed(2)} off`,
    };
  }
}
