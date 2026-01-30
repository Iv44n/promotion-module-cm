import z from 'zod';

export const cartDto = z.object({
  totalAmount: z.number().positive(),
  items: z.array(
    z.object({
      productId: z.uuid(),
      categoryId: z.uuid(),
      quantity: z.number().positive(),
      price: z.number().positive(),
    }),
  ),
});

export const applyPromotionDto = z.object({
  promotionId: z.uuid(),
  cart: cartDto,
});

export type ApplyPromotionDto = z.infer<typeof applyPromotionDto>;
export type CartDto = z.infer<typeof cartDto>;
