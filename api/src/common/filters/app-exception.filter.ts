import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { AppError } from './errors/app.error';
import { Response } from 'express';

@Catch(AppError)
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: AppError, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    res.status(exception.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: exception.code,
      message: exception.message,
    });
  }
}
