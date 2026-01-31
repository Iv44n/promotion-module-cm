import { AppError } from '@/common/filters/errors';

export class PromotionWithoutRulesError extends AppError {
  code: string = 'PROMOTION_WITHOUT_RULES';
  statusCode: number = 400;

  constructor(message: string) {
    super(message);
  }
}
