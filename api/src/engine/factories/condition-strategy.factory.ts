import { Injectable, Inject } from '@nestjs/common';
import {
  PromotionConditionStrategy,
  CONDITION_STRATEGIES,
} from '../strategies/conditions';

@Injectable()
export class ConditionStrategyFactory {
  private readonly strategyMap: Map<string, PromotionConditionStrategy>;

  constructor(
    @Inject(CONDITION_STRATEGIES)
    strategies: PromotionConditionStrategy[],
  ) {
    this.strategyMap = new Map();
    for (const strategy of strategies) {
      this.strategyMap.set(strategy.type, strategy);
    }
  }

  getStrategy(type: string): PromotionConditionStrategy | undefined {
    return this.strategyMap.get(type);
  }

  getRegisteredTypes(): string[] {
    return Array.from(this.strategyMap.keys());
  }
}
