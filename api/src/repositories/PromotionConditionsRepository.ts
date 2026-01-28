import {
  PromotionConditionInsert,
  PromotionConditionSelect,
} from 'src/database/drizzle.schema';
import { RepositoryBase } from 'src/interfaces/RepositoryBase';

export class PromotionConditionsRepository implements RepositoryBase<
  PromotionConditionSelect,
  PromotionConditionInsert
> {
  create(data: PromotionConditionInsert): Promise<PromotionConditionSelect> {
    throw new Error('Method not implemented.');
  }
  update(
    id: string,
    data: PromotionConditionInsert,
  ): Promise<PromotionConditionSelect> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<PromotionConditionSelect | null> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<PromotionConditionSelect[]> {
    throw new Error('Method not implemented.');
  }
}
