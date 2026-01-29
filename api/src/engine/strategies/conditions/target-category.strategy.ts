import { Injectable } from '@nestjs/common';
import { PromotionConditionStrategy } from './condition-strategy.interface';
import { Cart, TargetCategoryConfig } from '../../../interfaces';

@Injectable()
export class TargetCategoryStrategy implements PromotionConditionStrategy {
  readonly type = 'TARGET_CATEGORY' as const;

  validate(cart: Cart, config: unknown): boolean {
    const { categoryId } = config as TargetCategoryConfig;

    if (!categoryId) {
      return false;
    }

    return cart.items.some((item) => item.categoryId === categoryId);
  }
}
