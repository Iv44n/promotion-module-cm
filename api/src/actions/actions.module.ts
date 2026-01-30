import { Module } from '@nestjs/common';
import { ActionsRepository } from './actions.repository';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';

@Module({
  imports: [],
  controllers: [ActionsController],
  providers: [ActionsService, ActionsRepository],
})
export class ActionsModule {}
