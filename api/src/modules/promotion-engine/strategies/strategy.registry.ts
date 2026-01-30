import {
  PromotionActionType,
  PromotionConditionType,
} from '@/database/drizzle.schema';
import { PromotionConditionStrategy } from './conditions/base-condition.strategy';
import { PromotionActionStrategy } from './actions/base-action.strategy';

export class StrategyRegistry {
  private conditionStrategies: Map<
    PromotionConditionType,
    PromotionConditionStrategy
  >;
  private actionStrategies: Map<PromotionActionType, PromotionActionStrategy>;

  constructor() {
    this.conditionStrategies = new Map();
    this.actionStrategies = new Map();
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
