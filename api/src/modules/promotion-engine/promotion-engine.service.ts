import { Injectable } from '@nestjs/common';
import { PromotionEngineRepository } from './promotion-engine.repository';
import { StrategyRegistry } from './strategies/strategy.registry';
import { Action, actionSchema, Condition, conditionSchema } from './rules';
import {
  ApplyPromotionDto,
  type CartDto,
} from './dto/request/apply-promotion.dto';
import type { ApplyPromotionResultDto } from './dto/response/apply-promotion-result.dto';

@Injectable()
export class PromotionEngineService {
  constructor(
    private readonly promotionEngineRepository: PromotionEngineRepository,
    private readonly strategyRegistry: StrategyRegistry,
  ) {}

  async applyPromotions(
    applyPromotionDto: ApplyPromotionDto,
  ): Promise<ApplyPromotionResultDto> {
    const promotion =
      await this.promotionEngineRepository.getActivePromotionById(
        applyPromotionDto.promotionId,
      );

    const {
      data: promotionCondition,
      success,
      error,
    } = conditionSchema.safeParse({
      conditionType: promotion.condition.condition_type,
      configuration: promotion.condition.configuration,
    });

    if (!success) {
      return {
        status: 'NOT_APPLICABLE',
        promotionId: applyPromotionDto.promotionId,
        message: error.message,
        originalAmount: applyPromotionDto.cart.totalAmount,
        finalAmount: applyPromotionDto.cart.totalAmount,
        discount: 0,
      };
    }

    const conditionResult = this.verifyConditions(
      promotionCondition,
      applyPromotionDto.cart,
    );

    if (conditionResult) {
      const promotionAction = actionSchema.parse({
        actionType: promotion.action.action_type,
        configuration: promotion.action.configuration,
      });

      const result = this.applyActions(promotionAction, applyPromotionDto.cart);

      return {
        status: 'APPLIED',
        promotionId: applyPromotionDto.promotionId,
        message: result.message,
        originalAmount: applyPromotionDto.cart.totalAmount,
        finalAmount: result.finalAmount,
        discount: result.discount,
      };
    }

    return {
      status: 'NOT_APPLICABLE',
      promotionId: applyPromotionDto.promotionId,
      message: 'Condition not met',
      originalAmount: applyPromotionDto.cart.totalAmount,
      finalAmount: applyPromotionDto.cart.totalAmount,
      discount: 0,
    };
  }

  private verifyConditions(condition: Condition, card: CartDto): boolean {
    const conditionStrategy = this.strategyRegistry.getConditionStrategy(
      condition.conditionType,
    );

    return conditionStrategy.validate(card, condition);
  }

  private applyActions(action: Action, cart: CartDto) {
    const actionStrategy = this.strategyRegistry.getActionStrategy(
      action.actionType,
    );

    return actionStrategy.apply(cart, action);
  }
}
