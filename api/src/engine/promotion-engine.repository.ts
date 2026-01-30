import { Injectable, Inject } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
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

    try {
      const results = await this.db.query.promotions.findMany({
        where: eq(schema.promotions.isActive, true),
        with: {
          promotionConditions: true,
          promotionActions: true,
        },
      });

      if (!results || results.length === 0) {
        console.log('No se encontraron promociones activas en la DB');
        return [];
      }

      return results.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        isActive: p.isActive,
        startDate: p.start_date,
        endDate: p.end_date,
        conditions: p.promotionConditions.map((c) => ({
          id: c.id,
          conditionType: c.condition_type,
          configuration: c.configuration,
        })),
        actions: p.promotionActions.map((a) => ({
          id: a.id,
          actionType: a.action_type,
          configuration: a.configuration,
        })),
      }));
    } catch (error) {
      console.log(error);
      return [];
    }
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
