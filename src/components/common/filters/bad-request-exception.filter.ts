/* eslint-disable class-methods-use-this */
import {
  HttpStatus,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ExceptionResponse } from '../interfaces/exception-response.interface';

@Catch(BadRequestException)
export default class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const res = ctx.getResponse<ExpressResponse>();
    const exceptionResponse: null | ExceptionResponse = exception.getResponse
      ? (exception.getResponse() as ExceptionResponse)
      : null;
    const status: number = HttpStatus.BAD_REQUEST;

    if (exceptionResponse?.error === 'Validation error') {
      return res.status(status).json({
        statusCode: 400,
        message: 'Validation error',
        validationErrors: exceptionResponse?.message,
      });
    }

    return res.status(status).json({
      statusCode: 400,
      message: 'Bad request',
      error: exceptionResponse ? exceptionResponse.message : undefined,
    });
  }
}
