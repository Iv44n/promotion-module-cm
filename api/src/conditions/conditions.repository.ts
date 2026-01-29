import { Injectable } from '@nestjs/common';
import * as schema from 'src/database/drizzle.schema';

@Injectable()
export class ConditionsRepository {
  getAllConditions() {
    return schema.promotionConditionsTypesEnum.enumValues;
  }
}
