import { Injectable } from '@nestjs/common';
import * as promotionsMetadata from '@/database/drizzle.schema';

@Injectable()
export class MetadataService {
  getAllConditions() {
    return promotionsMetadata.promotionConditionsTypesEnum.enumValues;
  }

  getAllActions() {
    return promotionsMetadata.promotionActionsTypesEnum.enumValues;
  }
}
