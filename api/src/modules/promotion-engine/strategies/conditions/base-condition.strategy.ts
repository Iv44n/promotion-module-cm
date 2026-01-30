import type { PromotionConditionType } from '@/database/drizzle.schema';
import { CartDto } from '../../dto/request/apply-promotion.dto';
import { Condition } from '../../rules';

export interface PromotionConditionStrategy {
  readonly type: PromotionConditionType;

  validate(cart: CartDto, promotionCondition: Condition): boolean;
}
