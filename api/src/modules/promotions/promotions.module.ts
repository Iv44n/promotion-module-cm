import { Module } from '@nestjs/common';
import { DrizzleModule } from '@/database/drizzle.module';
import { PromotionsController } from './promotions.controller';
import { PromotionsService } from './promotions.service';
import { PromotionsRepository } from './promotions.repository';
import { MetadataController } from './metadata/metadata.controller';
import { MetadataService } from './metadata/metadata.service';

@Module({
  imports: [DrizzleModule],
  controllers: [PromotionsController, MetadataController],
  providers: [PromotionsService, PromotionsRepository, MetadataService],
})
export class PromotionsModule {}
