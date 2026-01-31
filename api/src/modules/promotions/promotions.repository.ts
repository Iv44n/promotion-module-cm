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
import { UpdatePromotionRequestDto } from './dto/request/update-promotion.dto';
import { PromotionNotFoundError } from '@/common/filters/errors';

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
    const promotion = await this.db.query.promotions.findFirst({
      where: eq(promotions.id, id),
    });

    if (!promotion) {
      throw new PromotionNotFoundError(`Promotion not found: ${id}`);
    }

    return {
      id: promotion.id,
      name: promotion.name,
      description: promotion.description,
      startDate: promotion.start_date,
      endDate: promotion.end_date,
      isActive: promotion.isActive,
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
    const promotionDeleted = await this.db
      .delete(promotions)
      .where(eq(promotions.id, promotionId))
      .returning({ deletedPromotionId: promotions.id });

    if (promotionDeleted.length === 0) {
      throw new PromotionNotFoundError(`Promotion not found: ${promotionId}`);
    }

    return promotionDeleted[0].deletedPromotionId;
  }

  async updatePromotion(promotionId: string, data: UpdatePromotionRequestDto) {
    const updatedPromotion = await this.db
      .update(promotions)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(promotions.id, promotionId))
      .returning();

    if (updatedPromotion.length === 0) {
      throw new PromotionNotFoundError(`Promotion not found: ${promotionId}`);
    }

    return updatedPromotion[0];
  }
}
