import { z } from 'zod';

export const ShowConditionsResponseDto = z.object({
  condition_type: z.string(),
});

export type ShowConditionsResponseDto = z.infer<
  typeof ShowConditionsResponseDto
>;
