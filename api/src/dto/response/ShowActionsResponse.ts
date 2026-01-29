import z from 'zod';

export const showActionsResponseDto = z.object({
  actionType: z.string(),
});

export type ShowActionsResponseDto = z.infer<typeof showActionsResponseDto>;
