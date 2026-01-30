import { Injectable } from '@nestjs/common';
import { PromotionsRepository } from './promotions.repository';
import { PromotionResponseDTO } from './dto/response/promotion-response.dto';
import { CreatePromotionRequestDto } from './dto/request/create-promotion.dto';
import { UpdatePromotionRequestDto } from './dto/request/update-promotion.dto';

@Injectable()
export class PromotionsService {
  constructor(private readonly promotionsRepository: PromotionsRepository) {}

  async getAllPromotions(): Promise<PromotionResponseDTO[]> {
    return await this.promotionsRepository.getAllPromotions();
  }

  async getPromotionById(id: string): Promise<PromotionResponseDTO> {
    return await this.promotionsRepository.getPromotionById(id);
  }

  async createPromotion(
    promotion: CreatePromotionRequestDto,
  ): Promise<PromotionResponseDTO> {
    return await this.promotionsRepository.createPromotion(promotion);
  }

  async deletePromotion(promotionId: string) {
    return await this.promotionsRepository.deletePromotion(promotionId);
  }

  async updatePromotion(promotionId: string, data: UpdatePromotionRequestDto) {
    return await this.promotionsRepository.updatePromotion(promotionId, data);
  }
}
