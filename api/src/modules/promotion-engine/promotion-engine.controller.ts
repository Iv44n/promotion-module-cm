import { Body, Controller, Post } from '@nestjs/common';
import { PromotionEngineService } from './promotion-engine.service';
import { applyPromotionDto } from './dto/request/apply-promotion.dto';
import { ApplyPromotionResultDto } from './dto/response/apply-promotion-result.dto';

@Controller('api/promotion-engine')
export class PromotionEngineController {
  constructor(
    private readonly promotionEngineService: PromotionEngineService,
  ) {}

  @Post('checkout')
  async checkout(@Body() body: unknown): Promise<ApplyPromotionResultDto> {
    const bodyParsed = applyPromotionDto.parse(body);
    return await this.promotionEngineService.applyPromotions(bodyParsed);
  }
}
