import { AppError } from '@/common/filters/errors';

export class InvalidPromotionConditionError extends AppError {
  code: string = 'INVALID_PROMOTION_CONDITION';
  statusCode: number = 400;

  constructor(message: string) {
    super(message);
  }
}
