import z from 'zod';

export const promotionStatusResponseDto = z.object({
  isActive: z.boolean(),
});

export type PromotionStatusResponseDto = z.infer<typeof promotionStatusResponseDto>;
