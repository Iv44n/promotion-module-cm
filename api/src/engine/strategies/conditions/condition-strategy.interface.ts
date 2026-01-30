import { Cart } from '../../../interfaces';

export interface PromotionConditionStrategy {
  readonly type: 'TARGET_CATEGORY' | 'MIN_AMOUNT';

  validate(cart: Cart, config: unknown): boolean;
}
export const CONDITION_STRATEGIES = 'CONDITION_STRATEGIES';
