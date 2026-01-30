import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  type CreatePromotionRequestDto,
  createPromotionRequestDto,
} from './dto/request/create-promotion.dto';
import { PromotionsService } from './promotions.service';
import { PromotionResponseDTO } from './dto/response/promotion-response.dto';

@Controller('api/promotions')
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

  @Delete(':promotionId')
  async deletePromotion(@Param('promotionId') promotionId: string) {
    const deletedPromotionId =
      await this.promotionsService.deletePromotion(promotionId);

    return {
      message: `Promotion with id ${deletedPromotionId} was deleted successfully`,
    };
  }
}
