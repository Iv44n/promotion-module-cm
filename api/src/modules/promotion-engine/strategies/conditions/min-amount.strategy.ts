import { MinAmountCondition } from '../../rules';
import { CartDto } from '../../dto/request/apply-promotion.dto';
import { PromotionConditionStrategy } from './base-condition.strategy';
import { PromotionConditionType } from '@/database/drizzle.schema';

export class MinAmountStrategy implements PromotionConditionStrategy {
  readonly type: PromotionConditionType = 'MIN_AMOUNT';

  validate(cart: CartDto, condition: MinAmountCondition): boolean {
    const { amount } = condition.configuration;

    if (typeof amount !== 'number' || amount < 0) {
      return false;
    }

    return cart.totalAmount >= amount;
  }
}
