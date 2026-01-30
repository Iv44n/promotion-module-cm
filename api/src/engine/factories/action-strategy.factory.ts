import { Injectable, Inject } from '@nestjs/common';
import {
  PromotionActionStrategy,
  ACTION_STRATEGIES,
} from '../strategies/actions';

@Injectable()
export class ActionStrategyFactory {
  private readonly strategyMap: Map<string, PromotionActionStrategy>;

  constructor(
    @Inject(ACTION_STRATEGIES)
    strategies: PromotionActionStrategy[],
  ) {
    this.strategyMap = new Map();
    for (const strategy of strategies) {
      this.strategyMap.set(strategy.type, strategy);
    }
  }

  getStrategy(type: string): PromotionActionStrategy | undefined {
    return this.strategyMap.get(type);
  }

  getRegisteredTypes(): string[] {
    return Array.from(this.strategyMap.keys());
  }
}
