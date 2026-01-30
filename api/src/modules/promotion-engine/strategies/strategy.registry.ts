import {
  PromotionActionType,
  PromotionConditionType,
} from '@/database/drizzle.schema';
import { PromotionConditionStrategy } from './conditions/base-condition.strategy';
import { PromotionActionStrategy } from './actions/base-action.strategy';
import { Injectable } from '@nestjs/common';
import { TargetCategoryStrategy } from './conditions/target-category.strategy';
import { PercentageDiscountStrategy } from './actions/percentage-discount.strategy';

@Injectable()
export class StrategyRegistry {
  private conditionStrategies: Map<
    PromotionConditionType,
    PromotionConditionStrategy
  >;
  private actionStrategies: Map<PromotionActionType, PromotionActionStrategy>;

  constructor() {
    this.conditionStrategies = new Map();
    this.actionStrategies = new Map();

    this.registerConditionStrategy(new TargetCategoryStrategy());
    this.registerActionStrategy(new PercentageDiscountStrategy());
  }

  registerConditionStrategy(strategy: PromotionConditionStrategy): void {
    this.conditionStrategies.set(strategy.type, strategy);
  }

  registerActionStrategy(strategy: PromotionActionStrategy): void {
    this.actionStrategies.set(strategy.type, strategy);
  }

  getConditionStrategy(
    type: PromotionConditionType,
  ): PromotionConditionStrategy {
    const strategy = this.conditionStrategies.get(type);
    if (!strategy) {
      throw new Error(`No strategy found for type: ${type}`);
    }
    return strategy;
  }

  getActionStrategy(type: PromotionActionType): PromotionActionStrategy {
    const strategy = this.actionStrategies.get(type);
    if (!strategy) {
      throw new Error(`No strategy found for type: ${type}`);
    }
    return strategy;
  }
}
