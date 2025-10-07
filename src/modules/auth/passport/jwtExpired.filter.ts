import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { TokenExpiredError } from 'jsonwebtoken';
import { Response } from 'express';

@Catch(TokenExpiredError)
export class JwtExpiredFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Narrow the exception type
    if (exception instanceof TokenExpiredError) {
      response.status(HttpStatus.NOT_ACCEPTABLE).json({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'JWT token has expired!',
      });
    } else {
      // fallback for unexpected errors
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error occurred.',
      });
    }
  }
}
