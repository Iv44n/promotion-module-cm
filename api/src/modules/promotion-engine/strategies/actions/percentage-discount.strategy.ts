import { PromotionActionType } from '@/database/drizzle.schema';
import { PromotionActionStrategy } from './base-action.strategy';
import { CartDto } from '../../dto/request/apply-promotion.dto';
import { PercentageDiscountAction } from '../../rules/actions';

export class PercentageDiscountStrategy implements PromotionActionStrategy {
  type: PromotionActionType = 'PERCENTAGE_DISCOUNT';

  apply(cart: CartDto, promotionAction: PercentageDiscountAction) {
    const { discountPercentage } = promotionAction.configuration;
    const discount = cart.totalAmount * (discountPercentage / 100);
    const finalAmount = cart.totalAmount - discount;

    return {
      message: `${discountPercentage}% discount applied`,
      finalAmount,
      discount,
    };
  }
}
