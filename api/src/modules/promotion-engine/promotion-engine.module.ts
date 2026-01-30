import { Module } from '@nestjs/common';
import { PromotionEngineController } from './promotion-engine.controller';
import { PromotionEngineService } from './promotion-engine.service';
import { PromotionEngineRepository } from './promotion-engine.repository';
import { StrategyRegistry } from './strategies/strategy.registry';
import { DrizzleModule } from '@/database/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [PromotionEngineController],
  providers: [
    PromotionEngineService,
    PromotionEngineRepository,
    StrategyRegistry,
  ],
})
export class PromotionEngineModule {}
