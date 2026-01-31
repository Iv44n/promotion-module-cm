import { AppError } from '@/common/filters/errors';

export class InvalidPromotionActionError extends AppError {
  code: string = 'INVALID_PROMOTION_ACTION';
  statusCode: number = 400;

  constructor(message: string) {
    super(message);
  }
}
