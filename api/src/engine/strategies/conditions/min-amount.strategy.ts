import { Injectable } from '@nestjs/common';
import { PromotionConditionStrategy } from './condition-strategy.interface';
import { Cart, MinAmountConfig } from '../../../interfaces';

@Injectable()
export class MinAmountStrategy implements PromotionConditionStrategy {
  readonly type = 'MIN_AMOUNT' as const;
  validate(cart: Cart, config: unknown): boolean {
    const { amount } = config as MinAmountConfig;

    if (typeof amount !== 'number' || amount < 0) {
      return false;
    }

    return cart.subtotal >= amount;
  }
}
