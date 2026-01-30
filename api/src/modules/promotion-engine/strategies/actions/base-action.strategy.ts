import type { PromotionActionType } from '@/database/drizzle.schema';

export interface PromotionActionStrategy {
  readonly type: PromotionActionType;

  apply(): void;
}
