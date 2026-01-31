import { AppError } from '@/common/filters/errors/app.error';

export class PromotionNotFoundError extends AppError {
  readonly code = 'PROMOTION_NOT_FOUND';
  readonly statusCode = 404;

  constructor(message: string) {
    super(message);
  }
}
