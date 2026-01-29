import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE_TOKEN } from 'src/database/drizzle.provider';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from 'src/database/drizzle.schema';

@Injectable()
export class ConditionsRepository {
  constructor(
    @Inject(DRIZZLE_TOKEN)
    private readonly db: NeonHttpDatabase<typeof schema>,
  ) {}

  getAllConditions() {
    return schema.promotionConditionsTypesEnum.enumValues;
  }
}
