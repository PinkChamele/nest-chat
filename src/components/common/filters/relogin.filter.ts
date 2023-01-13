/* eslint-disable class-methods-use-this */
import {
  Catch,
  ExceptionFilter,
  UnauthorizedException,
  ArgumentsHost,
} from '@nestjs/common';

@Catch(UnauthorizedException)
export default class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();

    res.redirect('/auth-render/login-form?error=Wrong+login+or+password!');
  }
}
