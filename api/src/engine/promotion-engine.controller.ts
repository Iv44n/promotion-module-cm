import { PromotionEngineService } from './promotion-engine.service';
import * as interfaces from '../interfaces';
import { Controller, Post } from '@nestjs/common';

@Controller('promotion-engine')
export class PromotionEngineController {
  constructor(private readonly promotionEngine: PromotionEngineService) {}
  @Post('checkout')
  async checkout(cart: interfaces.Cart) {
    const result = await this.promotionEngine.evaluatePromotions(cart);

    console.log(`Applied ${result.appliedDiscounts.length} promotions`);
    console.log(`Total discount: $${result.totalDiscount}`);
    console.log(`Final total: $${result.finalTotal}`);

    return result;
  }
}
