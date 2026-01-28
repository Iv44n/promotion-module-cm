import { PromotionInsert, PromotionSelect } from 'src/database/drizzle.schema';
import { RepositoryBase } from 'src/interfaces/RepositoryBase';

export class PromotionRepository implements RepositoryBase<
  PromotionSelect,
  PromotionInsert
> {
  create(data: PromotionInsert): Promise<PromotionSelect> {
    throw new Error('Method not implemented.');
  }
  update(id: string, data: PromotionInsert): Promise<PromotionSelect> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<PromotionSelect | null> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<PromotionSelect[]> {
    throw new Error('Method not implemented.');
  }
}
