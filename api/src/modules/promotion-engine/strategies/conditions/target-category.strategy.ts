import { PromotionConditionType } from '@/database/drizzle.schema';
import { CartDto } from '../../dto/request/apply-promotion.dto';
import { PromotionConditionStrategy } from './base-condition.strategy';
import { TargetCategoryCondition } from '../../rules';

export class TargetCategoryStrategy implements PromotionConditionStrategy {
  type: PromotionConditionType = 'TARGET_CATEGORY';

  validate(
    cart: CartDto,
    promotionCondition: TargetCategoryCondition,
  ): { isValid: boolean; message: string } {
    const { items } = cart;
    const { categoryId } = promotionCondition.configuration;

    const hasItemsInCategory = items.some(
      (item) => item.categoryId === categoryId,
    );

    return {
      isValid: hasItemsInCategory,
      message: hasItemsInCategory
        ? 'Condición cumplida'
        : 'El carrito no contiene productos de la categoría objetivo',
    };
  }
}
