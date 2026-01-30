import { Injectable } from '@nestjs/common';
import { PromotionResponseDTO } from 'src/dto/response/PromotionResponseDTO';
import { PromotionsRepository } from './promotions.repository';
import { CreatePromotionRequestDto } from 'src/dto/request/CreatePromotionRequestDto';

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

  async togglePromotionStatus(
    id: string,
    isActive: boolean,
  ): Promise<PromotionResponseDTO> {
    return await this.promotionsRepository.togglePromotionStatus(id, isActive);
  }

  async deletePromotion(id: string): Promise<void> {
    return await this.promotionsRepository.deletePromotion(id);
  }
}
