import { Body, Controller, Get, Post } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionResponseDTO } from 'src/dto/response/PromotionResponseDTO';
import {
  type CreatePromotionRequestDto,
  createPromotionRequestDto,
} from 'src/dto/request/CreatePromotionRequestDto';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  async getAllPromotions(): Promise<PromotionResponseDTO[]> {
    return await this.promotionsService.getAllPromotions();
  }

  @Post()
  async createPromotion(
    @Body() body: CreatePromotionRequestDto,
  ): Promise<PromotionResponseDTO> {
    const promotion = createPromotionRequestDto.parse(body);

    return await this.promotionsService.createPromotion(promotion);
  }
}
