import {
  PromotionTypeInsert,
  PromotionTypeSelect,
} from 'src/database/drizzle.schema';
import { RepositoryBase } from 'src/interfaces/RepositoryBase';

export class PromotionTypesRepository implements RepositoryBase<
  PromotionTypeSelect,
  PromotionTypeInsert
> {
  create(data: PromotionTypeInsert): Promise<PromotionTypeSelect> {
    throw new Error('Method not implemented.');
  }
  update(id: string, data: PromotionTypeInsert): Promise<PromotionTypeSelect> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<PromotionTypeSelect | null> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<PromotionTypeSelect[]> {
    throw new Error('Method not implemented.');
  }
}
