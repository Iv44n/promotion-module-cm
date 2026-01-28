import { actionSchema, conditionSchema } from '../../rules';
import z from 'zod';

export const CreatePromotionRequestDto = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  startDate: z.coerce.date().min(new Date()),
  endDate: z.coerce.date().min(new Date()),
  isActive: z.boolean().default(true),

  condition: conditionSchema,
  action: actionSchema,
});

export type CreatePromotionRequestDto = z.infer<
  typeof CreatePromotionRequestDto
>;
