import z from 'zod';

export const updatePromotionStatusDto = z.object({
  isActive: z.boolean(),
});

export type UpdatePromotionStatusDto = z.infer<typeof updatePromotionStatusDto>;
