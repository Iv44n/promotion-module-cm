import type { PromotionActionType } from '@/database/drizzle.schema';
import { type CartDto } from '../../dto/request/apply-promotion.dto';
import { Action } from '../../rules';

export interface PromotionActionStrategy {
  readonly type: PromotionActionType;

  apply(
    cart: CartDto,
    promotionAction: Action,
  ): {
    message: string;
    finalAmount: number;
    discount: number;
  };
}
