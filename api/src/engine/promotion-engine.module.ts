import { Module } from '@nestjs/common';
import { DrizzleAsyncProvider } from '../database/drizzle.provider';

import {
  TargetCategoryStrategy,
  MinAmountStrategy,
  CONDITION_STRATEGIES,
} from './strategies/conditions';
import {
  PercentageDiscountStrategy,
  FixedDiscountStrategy,
  ACTION_STRATEGIES,
} from './strategies/actions';

import { ConditionStrategyFactory, ActionStrategyFactory } from './factories';

import { PromotionEngineRepository } from './promotion-engine.repository';
import { PromotionEngineService } from './promotion-engine.service';
import { PromotionEngineController } from './promotion-engine.controller';

@Module({
  providers: [
    DrizzleAsyncProvider,

    TargetCategoryStrategy,
    MinAmountStrategy,
    {
      provide: CONDITION_STRATEGIES,
      useFactory: (
        targetCategory: TargetCategoryStrategy,
        minAmount: MinAmountStrategy,
      ) => [targetCategory, minAmount],
      inject: [TargetCategoryStrategy, MinAmountStrategy],
    },

    PercentageDiscountStrategy,
    FixedDiscountStrategy,
    {
      provide: ACTION_STRATEGIES,
      useFactory: (
        percentage: PercentageDiscountStrategy,
        fixed: FixedDiscountStrategy,
      ) => [percentage, fixed],
      inject: [PercentageDiscountStrategy, FixedDiscountStrategy],
    },

    ConditionStrategyFactory,
    ActionStrategyFactory,

    PromotionEngineRepository,
    PromotionEngineService,
  ],
  controllers: [PromotionEngineController],
  exports: [PromotionEngineService],
})
export class PromotionEngineModule {}
