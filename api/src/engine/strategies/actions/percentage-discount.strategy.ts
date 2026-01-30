import { Injectable } from '@nestjs/common';
import {
  PromotionActionStrategy,
  PromotionConditionInfo,
} from './action-strategy.interface';
import {
  Cart,
  AppliedDiscount,
  PercentageDiscountConfig,
  TargetCategoryConfig,
} from '../../../interfaces';

@Injectable()
export class PercentageDiscountStrategy implements PromotionActionStrategy {
  readonly type = 'PERCENTAGE_DISCOUNT' as const;

  apply(
    cart: Cart,
    config: unknown,
    promotionId: string,
    promotionName: string,
    conditions?: PromotionConditionInfo[],
  ): AppliedDiscount {
    const { discountPercentage } = config as PercentageDiscountConfig;

    const applicableSubtotal = this.getApplicableSubtotal(cart, conditions);

    const percentage = Math.min(Math.max(discountPercentage || 0, 0), 100);
    const discountAmount = (applicableSubtotal * percentage) / 100;

    return {
      promotionId,
      promotionName,
      discountType: 'PERCENTAGE_DISCOUNT',
      discountAmount: Math.round(discountAmount * 100) / 100,
      description: `${percentage}% off`,
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

    const { categoryId } = categoryCondition.configuration as TargetCategoryConfig;

    if (!categoryId) {
      return cart.subtotal;
    }

    return cart.items
      .filter((item) => item.categoryId === categoryId)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
