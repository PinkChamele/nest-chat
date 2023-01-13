/* eslint-disable class-methods-use-this */
import { Catch, ExceptionFilter, ArgumentsHost, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export default class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    Logger.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception?.getStatus() ?? 500;
    const request = ctx.getRequest<Request>();
    Logger.error(request);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
