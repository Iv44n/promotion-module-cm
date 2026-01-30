import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PromotionsModule } from './promotions/promotions.module';
import { ActionsModule } from './actions/actions.module';
import { PromotionEngineModule } from './engine/promotion-engine.module';
import { ConditionsModule } from './conditions/conditions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PromotionsModule,
    ActionsModule,
    PromotionEngineModule,
    ConditionsModule,
  ],
})
export class AppModule {}
