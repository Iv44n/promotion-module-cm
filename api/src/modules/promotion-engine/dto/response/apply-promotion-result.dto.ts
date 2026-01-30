import { z } from 'zod';

export const applyPromotionResultDto = z.object({
  status: z.enum(['APPLIED', 'NOT_APPLICABLE', 'ERROR']),
  promotionId: z.string(),
  message: z.string(),
  originalAmount: z.number(),
  finalAmount: z.number(),
  discount: z.number(),
});

export type ApplyPromotionResultDto = z.infer<typeof applyPromotionResultDto>;
