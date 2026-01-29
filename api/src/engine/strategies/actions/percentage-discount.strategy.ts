import { Injectable } from '@nestjs/common';
import { PromotionActionStrategy } from './action-strategy.interface';
import {
  Cart,
  AppliedDiscount,
  PercentageDiscountConfig,
} from '../../../interfaces';

@Injectable()
export class PercentageDiscountStrategy implements PromotionActionStrategy {
  readonly type = 'PERCENTAGE_DISCOUNT' as const;

  apply(
    cart: Cart,
    config: unknown,
    promotionId: string,
    promotionName: string,
  ): AppliedDiscount {
    const { discountPercentage } = config as PercentageDiscountConfig;

    const percentage = Math.min(Math.max(discountPercentage || 0, 0), 100);
    const discountAmount = (cart.subtotal * percentage) / 100;

    return {
      promotionId,
      promotionName,
      discountType: 'PERCENTAGE_DISCOUNT',
      discountAmount: Math.round(discountAmount * 100) / 100,
      description: `${percentage}% off`,
    };
  }
}
