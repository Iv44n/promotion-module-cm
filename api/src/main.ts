import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './exceptions/http-exception.filter';
import { ZodExceptionFilter } from './exceptions/zod-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter(), new ZodExceptionFilter());
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
