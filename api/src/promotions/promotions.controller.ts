import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
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

  @Patch(':id/status')
  async updatePromotionStatus(
    @Param('id') id: string,
    @Body() body: { isActive: boolean },
  ): Promise<PromotionResponseDTO> {
    return await this.promotionsService.togglePromotionStatus(
      id,
      body.isActive,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePromotion(@Param('id') id: string): Promise<void> {
    return await this.promotionsService.deletePromotion(id);
  }
}
