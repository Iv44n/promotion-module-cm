import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { createPromotionRequestDto } from './dto/request/create-promotion.dto';
import { PromotionsService } from './promotions.service';
import { PromotionResponseDTO } from './dto/response/promotion-response.dto';
import { updatePromotionRequestDto } from './dto/request/update-promotion.dto';

@Controller('api/promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  async getAllPromotions(): Promise<PromotionResponseDTO[]> {
    return await this.promotionsService.getAllPromotions();
  }

  @Post()
  async createPromotion(@Body() body: unknown): Promise<PromotionResponseDTO> {
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

  @Patch(':promotionId')
  async updatePromotion(
    @Param('promotionId') promotionId: string,
    @Body() body: unknown,
  ) {
    const dto = updatePromotionRequestDto.parse(body);

    const updatedPromotion = await this.promotionsService.updatePromotion(
      promotionId,
      dto,
    );

    return {
      message: `Promotion with id ${updatedPromotion.id} was updated successfully`,
    };
  }
}
