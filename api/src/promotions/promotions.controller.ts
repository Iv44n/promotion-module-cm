import { Controller, Get } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionResponseDTO } from 'src/dto/response/PromotionResponseDTO';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  async getAllPromotions(): Promise<PromotionResponseDTO[]> {
    return await this.promotionsService.getAllPromotions();
  }
}
