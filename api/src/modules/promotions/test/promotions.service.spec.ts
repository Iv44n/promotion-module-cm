/* eslint-disable @typescript-eslint/unbound-method */
import { CreatePromotionRequestDto } from '../dto/request/create-promotion.dto';
import { PromotionResponseDTO } from '../dto/response/promotion-response.dto';
import { PromotionsRepository } from '../promotions.repository';
import { PromotionsService } from '../promotions.service';

describe('PromotionsService (Unit)', () => {
  let service: PromotionsService;
  let repository: jest.Mocked<PromotionsRepository>;

  beforeEach(() => {
    repository = {
      createPromotion: jest.fn(),
      getPromotionById: jest.fn(),
      getAllPromotions: jest.fn(),
    } as Partial<
      jest.Mocked<PromotionsRepository>
    > as jest.Mocked<PromotionsRepository>;

    service = new PromotionsService(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPromotion', () => {
    it('should create a promotion and return it', async () => {
      // Arrange
      const dto: CreatePromotionRequestDto = {
        name: 'Promo nueva',
        description: 'Promo nueva',
        startDate: new Date(),
        endDate: new Date(),
        isActive: true,
        condition: {
          conditionType: 'MIN_AMOUNT',
          configuration: {
            amount: 100,
          },
        },
        action: {
          actionType: 'FIXED_DISCOUNT',
          configuration: {
            discountFixed: 10,
          },
        },
      };

      const createdPromotion: PromotionResponseDTO = {
        id: '1',
        name: 'Promo nueva',
        isActive: true,
        startDate: new Date(),
        endDate: new Date(),
      };

      repository.createPromotion.mockResolvedValue(createdPromotion);

      const result = await service.createPromotion(dto);

      expect(repository.createPromotion).toHaveBeenCalledTimes(1);
      expect(repository.createPromotion).toHaveBeenCalledWith(dto);
      expect(result).toEqual(createdPromotion);
    });

    it('should throw if repository fails', async () => {
      const dto: CreatePromotionRequestDto = {
        name: 'Promo nueva',
        description: 'Promo nueva',
        startDate: new Date(),
        endDate: new Date(),
        isActive: true,
        condition: {
          conditionType: 'MIN_AMOUNT',
          configuration: {
            amount: 100,
          },
        },
        action: {
          actionType: 'FIXED_DISCOUNT',
          configuration: {
            discountFixed: 10,
          },
        },
      };

      repository.createPromotion.mockRejectedValue(new Error('DB error'));

      await expect(service.createPromotion(dto)).rejects.toThrow('DB error');
    });
  });

  describe('getPromotionById', () => {
    it('should return a promotion when it exists', async () => {
      const promotion: PromotionResponseDTO = {
        id: '1',
        name: 'Promo nueva',
        isActive: true,
        startDate: new Date(),
        endDate: new Date(),
      };

      repository.getPromotionById.mockResolvedValue(promotion);

      const result = await service.getPromotionById('1');

      expect(repository.getPromotionById).toHaveBeenCalledWith('1');
      expect(result).toEqual(promotion);
    });
  });

  describe('getAllPromotions', () => {
    it('should return all promotions', async () => {
      const promotions: PromotionResponseDTO[] = [
        {
          id: '1',
          name: 'Promo nueva',
          isActive: true,
          startDate: new Date(),
          endDate: new Date(),
        },
        {
          id: '2',
          name: 'Promo nueva',
          isActive: true,
          startDate: new Date(),
          endDate: new Date(),
        },
      ];

      repository.getAllPromotions.mockResolvedValue(promotions);

      const result = await service.getAllPromotions();

      expect(repository.getAllPromotions).toHaveBeenCalledTimes(1);
      expect(result).toEqual(promotions);
    });

    it('should return an empty array when there are no promotions', async () => {
      repository.getAllPromotions.mockResolvedValue([]);

      const result = await service.getAllPromotions();

      expect(result).toEqual([]);
    });
  });
});
