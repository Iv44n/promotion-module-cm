import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { DrizzleModule } from 'src/database/drizzle.module';
import { PromotionsRepository } from './promotions.repository';
import { PromotionsController } from './promotions.controller';

@Module({
  imports: [DrizzleModule],
  controllers: [PromotionsController],
  providers: [PromotionsService, PromotionsRepository, DrizzleModule],
})
export class PromotionsModule {}
