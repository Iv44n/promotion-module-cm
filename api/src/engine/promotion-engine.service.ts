import { Injectable, Logger } from '@nestjs/common';
import {
  PromotionEngineRepository,
  PromotionWithDetails,
} from './promotion-engine.repository';
import { ConditionStrategyFactory, ActionStrategyFactory } from './factories';
import { Cart, AppliedDiscount, PromotionResult } from '../interfaces';

@Injectable()
export class PromotionEngineService {
  private readonly logger = new Logger(PromotionEngineService.name);

  constructor(
    private readonly promotionRepository: PromotionEngineRepository,
    private readonly conditionFactory: ConditionStrategyFactory,
    private readonly actionFactory: ActionStrategyFactory,
  ) {}

  async evaluatePromotions(cart: Cart): Promise<PromotionResult> {
    const appliedDiscounts: AppliedDiscount[] = [];

    const activePromotions =
      await this.promotionRepository.getActivePromotions();
    this.logger.log(`Found ${activePromotions.length} active promotions`);

    for (const promotion of activePromotions) {
      const isValid = this.validatePromotionConditions(cart, promotion);

      if (isValid) {
        const discounts = this.applyPromotionActions(cart, promotion);
        appliedDiscounts.push(...discounts);
        this.logger.log(`Applied promotion: ${promotion.name}`);
      }
    }

    const totalDiscount = appliedDiscounts.reduce(
      (sum, discount) => sum + discount.discountAmount,
      0,
    );
    const finalTotal = Math.max(cart.subtotal - totalDiscount, 0);

    return {
      cart,
      appliedDiscounts,
      totalDiscount: Math.round(totalDiscount * 100) / 100,
      finalTotal: Math.round(finalTotal * 100) / 100,
    };
  }

  private validatePromotionConditions(
    cart: Cart,
    promotion: PromotionWithDetails,
  ): boolean {
    if (promotion.conditions.length === 0) {
      return true;
    }

    for (const condition of promotion.conditions) {
      const strategy = this.conditionFactory.getStrategy(
        condition.conditionType,
      );

      if (!strategy) {
        this.logger.warn(
          `No strategy found for condition type: ${condition.conditionType}`,
        );
        return false;
      }

      const isValid = strategy.validate(cart, condition.configuration);
      if (!isValid) {
        this.logger.debug(
          `Condition ${condition.conditionType} failed for promotion ${promotion.name}`,
        );
        return false;
      }
    }

    return true;
  }

  private applyPromotionActions(
    cart: Cart,
    promotion: PromotionWithDetails,
  ): AppliedDiscount[] {
    const discounts: AppliedDiscount[] = [];

    for (const action of promotion.actions) {
      const strategy = this.actionFactory.getStrategy(action.actionType);

      if (!strategy) {
        this.logger.warn(
          `No strategy found for action type: ${action.actionType}`,
        );
        continue;
      }

      const discount = strategy.apply(
        cart,
        action.configuration,
        promotion.id,
        promotion.name,
      );
      discounts.push(discount);
    }

    return discounts;
  }

  async getActivePromotions(): Promise<PromotionWithDetails[]> {
    return this.promotionRepository.getActivePromotions();
  }
}
