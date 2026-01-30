import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@/database/drizzle.schema';
import { CreatePromotionRequestDto } from '../dto/request/create-promotion.dto';
import { PromotionsRepository } from '../promotions.repository';

const createPromotionMock = (
  overrides?: Partial<CreatePromotionRequestDto>,
): CreatePromotionRequestDto => ({
  name: 'Test Promotion',
  description: 'Test Promotion Description',
  startDate: new Date(),
  endDate: new Date(),
  isActive: true,
  condition: {
    conditionType: 'TARGET_CATEGORY',
    configuration: {
      categoryId: 'category-id',
    },
  },
  action: {
    actionType: 'FIXED_DISCOUNT',
    configuration: {
      discountFixed: 10,
    },
  },
  ...overrides,
});

describe('PromotionsRepository – Integration', () => {
  let pool: Pool;
  let db: NodePgDatabase<typeof schema>;
  let repository: PromotionsRepository;

  beforeAll(async () => {
    pool = new Pool({
      connectionString: process.env.TEST_DATABASE_URL,
    });

    db = drizzle(pool, { schema });
    repository = new PromotionsRepository(db);

    await pool.query('select 1');
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    await db.delete(schema.promotionActions);
    await db.delete(schema.promotionConditions);
    await db.delete(schema.promotions);
  });

  describe('getAllPromotions', () => {
    it('returns empty array when no promotions exist', async () => {
      const promotions = await repository.getAllPromotions();

      expect(promotions).toEqual([]);
    });

    it('returns all created promotions', async () => {
      await repository.createPromotion(
        createPromotionMock({ name: 'Promo 1' }),
      );
      await repository.createPromotion(
        createPromotionMock({
          name: 'Promo 2',
          action: {
            actionType: 'FIXED_DISCOUNT',
            configuration: { discountFixed: 20 },
          },
        }),
      );

      const promotions = await repository.getAllPromotions();

      expect(promotions).toHaveLength(2);
      expect(promotions.map((p) => p.name)).toEqual(
        expect.arrayContaining(['Promo 1', 'Promo 2']),
      );
    });
  });

  describe('createPromotion', () => {
    it('persists a promotion with condition and action', async () => {
      const promotion = await repository.createPromotion(createPromotionMock());

      expect(promotion.id).toBeDefined();
      expect(promotion.name).toBe('Test Promotion');
      expect(promotion.isActive).toBe(true);
    });
  });

  describe('getPromotionById', () => {
    it('returns a promotion when it exists', async () => {
      const created = await repository.createPromotion(createPromotionMock());

      const found = await repository.getPromotionById(created.id);

      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
      expect(found?.name).toBe(created.name);
    });
    it('throws an error when promotion does not exist', async () => {
      await expect(
        repository.getPromotionById('non-existing-id'),
      ).rejects.toThrow();
    });
  });
});
