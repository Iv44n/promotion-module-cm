import { PromotionActionType } from '@/database/drizzle.schema';
import { PromotionActionStrategy } from './base-action.strategy';

export class PercentageDiscountStrategy implements PromotionActionStrategy {
  type: PromotionActionType = 'PERCENTAGE_DISCOUNT';

  apply(): void {
    throw new Error('Method not implemented.');
  }
}
