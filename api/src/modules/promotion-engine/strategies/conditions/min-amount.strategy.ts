import { MinAmountCondition } from '../../rules';
import { CartDto } from '../../dto/request/apply-promotion.dto';
import { PromotionConditionStrategy } from './base-condition.strategy';
import { PromotionConditionType } from '@/database/drizzle.schema';

export class MinAmountStrategy implements PromotionConditionStrategy {
  readonly type: PromotionConditionType = 'MIN_AMOUNT';

  validate(
    cart: CartDto,
    condition: MinAmountCondition,
  ): { isValid: boolean; message: string } {
    const { amount } = condition.configuration;

    if (typeof amount !== 'number' || amount < 0) {
      return { isValid: false, message: 'Monto mínimo inválido' };
    }

    const amountIsNotEnough = cart.totalAmount < amount;

    return {
      isValid: !amountIsNotEnough,
      message: amountIsNotEnough
        ? `El monto total del carrito es menor al monto mínimo (${amount})`
        : 'Condición cumplida',
    };
  }
}
