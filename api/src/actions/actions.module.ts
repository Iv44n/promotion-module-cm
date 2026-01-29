import { Module } from '@nestjs/common';
import { DrizzleModule } from 'src/database/drizzle.module';

import { ActionsRepository } from './actions.repository';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';
import { DrizzleAsyncProvider } from 'src/database/drizzle.provider';

@Module({
  imports: [DrizzleModule],
  controllers: [ActionsController],
  providers: [ActionsRepository, DrizzleAsyncProvider],
})
export class ActionsModule {}
