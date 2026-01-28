import z from 'zod';

export const PromotionResponseDTOSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    description: z.string().optional(),
    isActive: z.boolean(),
    startDate: z.date(),
    endDate: z.date(),
});

export type PromotionResponseDTO = z.infer<typeof PromotionResponseDTOSchema>;
