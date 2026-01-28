import { Injectable } from '@nestjs/common';
import { PromotionResponseDTO } from 'src/dto/response/PromotionResponseDTO';
import { eq } from 'drizzle-orm';
import { PromotionsRepository } from './promotions.repository';

@Injectable()
export class PromotionsService {
  constructor(private readonly promotionsRepository: PromotionsRepository) {}

  async getAllPromotions(): Promise<PromotionResponseDTO[]> {
    return await this.promotionsRepository.getAllPromotions();
  }

  async getPromotionById(id: string): Promise<PromotionResponseDTO> {
    return await this.promotionsRepository.getPromotionById(id);
  }
}
