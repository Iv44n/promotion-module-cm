import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(error: ZodError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const errors = error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    response.status(400).json({
      statusCode: 400,
      message: 'Error de validación',
      errors,
    });
  }
}
