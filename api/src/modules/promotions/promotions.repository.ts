import { DRIZZLE_TOKEN } from '@/database/drizzle.provider';
import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@/database/drizzle.schema';
import { eq } from 'drizzle-orm';
import { promotions } from './entities/promotion.entity';
import {
  promotionActions,
  promotionConditions,
} from './entities/promotion-rules.entity';
import { PromotionResponseDTO } from './dto/response/promotion-response.dto';
import { CreatePromotionRequestDto } from './dto/request/create-promotion.dto';

@Injectable()
export class PromotionsRepository {
  constructor(
    @Inject(DRIZZLE_TOKEN)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async getAllPromotions(): Promise<PromotionResponseDTO[]> {
    return await this.db
      .select({
        id: promotions.id,
        name: promotions.name,
        description: promotions.description,
        startDate: promotions.start_date,
        endDate: promotions.end_date,
        isActive: promotions.isActive,
      })
      .from(promotions);
  }

  async getPromotionById(id: string): Promise<PromotionResponseDTO> {
    const [promotionInDB] = await this.db
      .select()
      .from(promotions)
      .where(eq(promotions.id, id))
      .limit(1);

    if (!promotionInDB) {
      throw new Error('Promotion not found');
    }

    return {
      id: promotionInDB.id,
      name: promotionInDB.name,
      description: promotionInDB.description,
      startDate: promotionInDB.start_date,
      endDate: promotionInDB.end_date,
      isActive: promotionInDB.isActive,
    };
  }

  async createPromotion(
    promotion: CreatePromotionRequestDto,
  ): Promise<PromotionResponseDTO> {
    return this.db.transaction(async (tx) => {
      const [createdPromotion] = await tx
        .insert(promotions)
        .values({
          name: promotion.name,
          description: promotion.description,
          start_date: promotion.startDate,
          end_date: promotion.endDate,
          isActive: promotion.isActive,
        })
        .returning();

      await tx.insert(promotionConditions).values({
        promotion_id: createdPromotion.id,
        condition_type: promotion.condition.conditionType,
        configuration: promotion.condition.configuration,
      });

      await tx.insert(promotionActions).values({
        promotion_id: createdPromotion.id,
        action_type: promotion.action.actionType,
        configuration: promotion.action.configuration,
      });

      return {
        id: createdPromotion.id,
        name: createdPromotion.name,
        description: createdPromotion.description,
        startDate: createdPromotion.start_date,
        endDate: createdPromotion.end_date,
        isActive: createdPromotion.isActive,
      };
    });
  }

  async deletePromotion(promotionId: string) {
    const { deletedPromotionId } = await this.db
      .delete(promotions)
      .where(eq(promotions.id, promotionId))
      .returning({ deletedPromotionId: promotions.id })
      .then((result) => result[0]);

    if (!deletedPromotionId) {
      throw new Error('Promotion not found');
    }

    return deletedPromotionId;
  }
}
