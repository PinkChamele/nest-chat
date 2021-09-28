/* eslint-disable class-methods-use-this */
import {
  Catch,
  ExceptionFilter,
  UnauthorizedException,
  ArgumentsHost,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(UnauthorizedException)
export default class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception?.getStatus() ?? 500;
    const request = ctx.getRequest<Request>();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
