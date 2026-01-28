export interface RepositoryBase<TSelect, TInsert> {
  create(data: TInsert): Promise<TSelect>;
  update(id: string, data: TInsert): Promise<TSelect>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<TSelect | null>;
  findAll(): Promise<TSelect[]>;
}
