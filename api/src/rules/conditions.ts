import z from 'zod';

export const targetCategoryConditionSchema = z.object({
  conditionType: z.literal('TARGET_CATEGORY'),
  configuration: z.object({
    categoryId: z.uuid(),
  }),
});

export const minAmountConditionSchema = z.object({
  conditionType: z.literal('MIN_AMOUNT'),
  configuration: z.object({
    amount: z.number().positive(),
  }),
});

export const conditionSchema = z.discriminatedUnion('conditionType', [
  targetCategoryConditionSchema,
  minAmountConditionSchema,
]);

export type Condition = z.infer<typeof conditionSchema>;
