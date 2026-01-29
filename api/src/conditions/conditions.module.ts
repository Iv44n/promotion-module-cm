import { Module } from '@nestjs/common';
import { DrizzleModule } from 'src/database/drizzle.module';
import { ConditionsController } from './conditions.controller';
import { ConditionsService } from './conditions.service';
import { ConditionsRepository } from './conditions.repository';

@Module({
  imports: [DrizzleModule],
  controllers: [ConditionsController],
  providers: [ConditionsService, ConditionsRepository],
})
export class ConditionsModule {}
