import { Injectable } from '@nestjs/common';
import {
  PromotionActionStrategy,
  PromotionConditionInfo,
} from './action-strategy.interface';
import {
  Cart,
  AppliedDiscount,
  FixedDiscountConfig,
  TargetCategoryConfig,
} from '../../../interfaces';

@Injectable()
export class FixedDiscountStrategy implements PromotionActionStrategy {
  readonly type = 'FIXED_DISCOUNT' as const;

  apply(
    cart: Cart,
    config: unknown,
    promotionId: string,
    promotionName: string,
    conditions?: PromotionConditionInfo[],
  ): AppliedDiscount {
    const { discountFixed } = config as FixedDiscountConfig;

    const applicableSubtotal = this.getApplicableSubtotal(cart, conditions);

    const discountAmount = Math.min(discountFixed || 0, applicableSubtotal);

    return {
      promotionId,
      promotionName,
      discountType: 'FIXED_DISCOUNT',
      discountAmount: Math.round(discountAmount * 100) / 100,
      description: `$${discountAmount.toFixed(2)} off`,
    };
  }

  private getApplicableSubtotal(
    cart: Cart,
    conditions?: PromotionConditionInfo[],
  ): number {
    const categoryCondition = conditions?.find(
      (c) => c.conditionType === 'TARGET_CATEGORY',
    );

    if (!categoryCondition) {
      return cart.subtotal;
    }

    const { categoryId } =
      categoryCondition.configuration as TargetCategoryConfig;

    if (!categoryId) {
      return cart.subtotal;
    }

    return cart.items
      .filter((item) => item.categoryId === categoryId)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
