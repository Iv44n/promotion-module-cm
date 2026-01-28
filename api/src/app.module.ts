import { Module } from '@nestjs/common';
import { DrizzleModule } from './database/drizzle.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DrizzleModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
