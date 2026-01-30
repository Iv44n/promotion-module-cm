import type { PromotionConditionType } from '@/database/drizzle.schema';

export interface PromotionConditionStrategy {
  readonly type: PromotionConditionType;

  validate(config: unknown): void;
}
