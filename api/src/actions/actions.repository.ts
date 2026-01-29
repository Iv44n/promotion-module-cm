import { Injectable } from '@nestjs/common';
import * as schema from '../database/drizzle.schema';

@Injectable()
export class ActionsRepository {
  getActionTypes() {
    return schema.promotionActionsTypesEnum.enumValues;
  }
}
