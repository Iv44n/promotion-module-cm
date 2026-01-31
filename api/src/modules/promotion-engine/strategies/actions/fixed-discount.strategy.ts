import { PromotionActionType } from '@/database/drizzle.schema';
import { PromotionActionStrategy } from './base-action.strategy';
import { CartDto } from '../../dto/request/apply-promotion.dto';
import { FixedDiscountAction } from '../../rules/actions';

export class FixedDiscountStrategy implements PromotionActionStrategy {
  type: PromotionActionType = 'FIXED_DISCOUNT';

  apply(cart: CartDto, promotionAction: FixedDiscountAction) {
    const { discountFixed } = promotionAction.configuration;
    const discount = Math.min(discountFixed, cart.totalAmount);
    const finalAmount = cart.totalAmount - discount;

    return {
      message: `$${discountFixed} fixed discount applied`,
      finalAmount,
      discount,
    };
  }
}
