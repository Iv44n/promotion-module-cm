import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { ZodExceptionFilter } from './common/filters/zod-exception.filter';
import { AppExceptionFilter } from './common/filters/app-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(
    new GlobalExceptionFilter(),
    new ZodExceptionFilter(),
    new AppExceptionFilter(),
  );
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
