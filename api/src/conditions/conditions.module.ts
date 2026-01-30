import { Module } from '@nestjs/common';
import { ConditionsController } from './conditions.controller';
import { ConditionsService } from './conditions.service';
import { ConditionsRepository } from './conditions.repository';

@Module({
  imports: [],
  controllers: [ConditionsController],
  providers: [ConditionsService, ConditionsRepository],
})
export class ConditionsModule {}
