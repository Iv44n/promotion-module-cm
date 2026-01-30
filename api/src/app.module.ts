import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PromotionsModule } from './modules/promotions/promotions.module';

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
