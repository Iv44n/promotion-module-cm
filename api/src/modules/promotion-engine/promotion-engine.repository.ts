import { DRIZZLE_TOKEN } from '@/database/drizzle.provider';
import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@/database/drizzle.schema';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class PromotionEngineRepository {
  constructor(
    @Inject(DRIZZLE_TOKEN)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async getActivePromotionById(promotionId: string) {
    const result = await this.db
      .select({
        promotion: schema.promotions,
        actions: schema.promotionActions,
        conditions: schema.promotionConditions,
      })
      .from(schema.promotions)
      .where(
        and(
          eq(schema.promotions.id, promotionId),
          eq(schema.promotions.isActive, true),
        ),
      )
      .leftJoin(
        schema.promotionActions,
        eq(schema.promotions.id, schema.promotionActions.promotion_id),
      )
      .leftJoin(
        schema.promotionConditions,
        eq(schema.promotions.id, schema.promotionConditions.promotion_id),
      )
      .limit(1);

    const record = result[0];

    if (!record?.promotion) {
      console.log(`Promoción activa con id "${promotionId}" no encontrada`);
      throw new Error(`Promoción activa con id "${promotionId}" no encontrada`);
    }

    if (!record?.actions || !record?.conditions) {
      console.log(
        `Promoción activa con id "${promotionId}" no tiene acciones o condiciones`,
      );
      throw new Error(
        `Promoción activa con id "${promotionId}" no tiene acciones o condiciones`,
      );
    }

    const { promotion, actions, conditions } = record;

    return {
      ...promotion,
      action: actions,
      condition: conditions,
    };
  }
}
