import { PromotionConditionType } from '@/database/drizzle.schema';
import { CartDto } from '../../dto/request/apply-promotion.dto';
import { PromotionConditionStrategy } from './base-condition.strategy';
import { TargetCategoryCondition } from '../../rules';

export class TargetCategoryStrategy implements PromotionConditionStrategy {
  type: PromotionConditionType = 'TARGET_CATEGORY';

  validate(
    cart: CartDto,
    promotionCondition: TargetCategoryCondition,
  ): boolean {
    const { items } = cart;
    const { categoryId } = promotionCondition.configuration;

    return items.some((item) => item.categoryId === categoryId);
  }
}
