import {
  PromotionActionInsert,
  PromotionActionSelect,
} from 'src/database/drizzle.schema';
import { RepositoryBase } from 'src/interfaces/RepositoryBase';

export class PromotionActionsRepository implements RepositoryBase<
  PromotionActionSelect,
  PromotionActionInsert
> {
  create(data: PromotionActionInsert): Promise<PromotionActionSelect> {
    throw new Error('Method not implemented.');
  }
  update(
    id: string,
    data: PromotionActionInsert,
  ): Promise<PromotionActionSelect> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<PromotionActionSelect | null> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<PromotionActionSelect[]> {
    throw new Error('Method not implemented.');
  }
}
