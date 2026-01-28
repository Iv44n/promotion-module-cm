import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../database/drizzle.schema';
import { PromotionResponseDTO } from 'src/dto/response/PromotionResponseDTO';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE_TOKEN } from 'src/database/drizzle.provider';

@Injectable()
export class PromotionsRepository {
  constructor(
    @Inject(DRIZZLE_TOKEN)
    private readonly db: NeonHttpDatabase<typeof schema>,
  ) {}

  async getAllPromotions(): Promise<PromotionResponseDTO[]> {
    return await this.db
      .select({
        id: schema.promotions.id,
        name: schema.promotions.name,
        description: schema.promotions.description,
        startDate: schema.promotions.start_date,
        endDate: schema.promotions.end_date,
        isActive: schema.promotions.isActive,
      })
      .from(schema.promotions);
  }

  async getPromotionById(id: string): Promise<PromotionResponseDTO> {
    const promotionInDB = await this.db.query.promotions.findFirst({
      where: eq(schema.promotions.id, id),
      columns: {
        id: true,
        name: true,
        description: true,
        start_date: true,
        end_date: true,
        isActive: true,
      },
    });

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
}
