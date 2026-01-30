import {
  actionSchema,
  conditionSchema,
} from '@/modules/promotion-engine/rules';
import z from 'zod';

export const promotionSchemaBase = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  startDate: z.coerce.date().min(new Date()),
  endDate: z.coerce.date().min(new Date()),
  isActive: z.boolean().default(true),
});

export const createPromotionRequestDto = promotionSchemaBase.extend({
  condition: conditionSchema,
  action: actionSchema,
});

export type CreatePromotionRequestDto = z.infer<
  typeof createPromotionRequestDto
>;
