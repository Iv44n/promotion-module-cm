import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { PromotionEngineModule } from './modules/promotion-engine/promotion-engine.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PromotionsModule,
    PromotionEngineModule,
  ],
})
export class AppModule {}
