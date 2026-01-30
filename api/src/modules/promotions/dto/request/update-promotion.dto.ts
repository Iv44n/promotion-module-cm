import { promotionSchemaBase } from './create-promotion.dto';
import z from 'zod';

export const updatePromotionRequestDto = promotionSchemaBase.partial();

export type UpdatePromotionRequestDto = z.infer<
  typeof updatePromotionRequestDto
>;
