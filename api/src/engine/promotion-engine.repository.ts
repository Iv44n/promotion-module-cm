import { Injectable, Inject } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { and, eq, lte, gte } from 'drizzle-orm';
import * as schema from '../database/drizzle.schema';
import { DRIZZLE_TOKEN } from '../database/drizzle.provider';

export interface PromotionWithDetails {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  conditions: Array<{
    id: number;
    conditionType: 'TARGET_CATEGORY' | 'MIN_AMOUNT';
    configuration: unknown;
  }>;
  actions: Array<{
    id: number;
    actionType: 'PERCENTAGE_DISCOUNT' | 'FIXED_DISCOUNT';
    configuration: unknown;
  }>;
}

@Injectable()
export class PromotionEngineRepository {
  constructor(
    @Inject(DRIZZLE_TOKEN)
    private readonly db: NeonHttpDatabase<typeof schema>,
  ) {}

  async getActivePromotions(): Promise<PromotionWithDetails[]> {
    const now = new Date();

    const activePromotions = await this.db
      .select({
        id: schema.promotions.id,
        name: schema.promotions.name,
        description: schema.promotions.description,
        isActive: schema.promotions.isActive,
        startDate: schema.promotions.start_date,
        endDate: schema.promotions.end_date,
      })
      .from(schema.promotions)
      .where(
        and(
          eq(schema.promotions.isActive, true),
          lte(schema.promotions.start_date, now),
          gte(schema.promotions.end_date, now),
        ),
      );

    const promotionsWithDetails: PromotionWithDetails[] = [];

    for (const promotion of activePromotions) {
      const conditions = await this.db
        .select({
          id: schema.promotionConditions.id,
          conditionType: schema.promotionConditions.condition_type,
          configuration: schema.promotionConditions.configuration,
        })
        .from(schema.promotionConditions)
        .where(eq(schema.promotionConditions.promotion_id, promotion.id));

      const actions = await this.db
        .select({
          id: schema.promotionActions.id,
          actionType: schema.promotionActions.action_type,
          configuration: schema.promotionActions.configuration,
        })
        .from(schema.promotionActions)
        .where(eq(schema.promotionActions.promotion_id, promotion.id));

      promotionsWithDetails.push({
        ...promotion,
        conditions,
        actions,
      });
    }

    return promotionsWithDetails;
  }

  async getPromotionById(
    promotionId: string,
  ): Promise<PromotionWithDetails | null> {
    const promotion = await this.db.query.promotions.findFirst({
      where: eq(schema.promotions.id, promotionId),
    });

    if (!promotion) {
      return null;
    }

    const conditions = await this.db
      .select({
        id: schema.promotionConditions.id,
        conditionType: schema.promotionConditions.condition_type,
        configuration: schema.promotionConditions.configuration,
      })
      .from(schema.promotionConditions)
      .where(eq(schema.promotionConditions.promotion_id, promotionId));

    const actions = await this.db
      .select({
        id: schema.promotionActions.id,
        actionType: schema.promotionActions.action_type,
        configuration: schema.promotionActions.configuration,
      })
      .from(schema.promotionActions)
      .where(eq(schema.promotionActions.promotion_id, promotionId));

    return {
      id: promotion.id,
      name: promotion.name,
      description: promotion.description,
      isActive: promotion.isActive,
      startDate: promotion.start_date,
      endDate: promotion.end_date,
      conditions,
      actions,
    };
  }
}
