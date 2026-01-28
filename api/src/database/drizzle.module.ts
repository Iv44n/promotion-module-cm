import { Module } from '@nestjs/common';
import { DrizzleAsyncProvider, DRIZZLE_TOKEN } from './drizzle.provider';

@Module({
  providers: [DrizzleAsyncProvider],
  exports: [DRIZZLE_TOKEN],
})
export class DrizzleModule {}
