import { AppError } from '@/common/filters/errors';
import {
  PromotionActionType,
  PromotionConditionType,
} from '@/database/drizzle.schema';

export class ConditionStrategyNotFoundError extends AppError {
  readonly code = 'CONDITION_STRATEGY_NOT_FOUND';
  readonly statusCode = 500;

  constructor(type: PromotionConditionType) {
    super(`No condition strategy registered for type: ${type}`);
  }
}

export class ActionStrategyNotFoundError extends AppError {
  readonly code = 'ACTION_STRATEGY_NOT_FOUND';
  readonly statusCode = 500;

  constructor(type: PromotionActionType) {
    super(`No action strategy registered for type: ${type}`);
  }
}
