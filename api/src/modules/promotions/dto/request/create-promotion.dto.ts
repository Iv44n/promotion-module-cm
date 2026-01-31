import {
  actionSchema,
  conditionSchema,
} from '@/modules/promotion-engine/rules';
import z from 'zod';

const today = new Date();
today.setHours(0, 0, 0, 0);

export const promotionSchemaBase = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  startDate: z.coerce.date().min(today),
  endDate: z.coerce.date().min(today),
  isActive: z.boolean().default(true),
});

export const createPromotionRequestDto = promotionSchemaBase.extend({
  condition: conditionSchema,
  action: actionSchema,
});

export type CreatePromotionRequestDto = z.infer<
  typeof createPromotionRequestDto
>;
