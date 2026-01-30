import z from 'zod';

export const percentageDiscountActionSchema = z.object({
  actionType: z.literal('PERCENTAGE_DISCOUNT'),
  configuration: z.object({
    discountPercentage: z.number().min(1).max(100),
  }),
});

export const fixedDiscountActionSchema = z.object({
  actionType: z.literal('FIXED_DISCOUNT'),
  configuration: z.object({
    discountFixed: z.number().positive(),
  }),
});

export const actionSchema = z.discriminatedUnion('actionType', [
  percentageDiscountActionSchema,
  fixedDiscountActionSchema,
]);

export type PercentageDiscountAction = z.infer<
  typeof percentageDiscountActionSchema
>;
export type FixedDiscountAction = z.infer<typeof fixedDiscountActionSchema>;
export type Action = z.infer<typeof actionSchema>;
