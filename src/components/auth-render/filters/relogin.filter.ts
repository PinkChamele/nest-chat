import {
  Catch,
  ExceptionFilter,
  UnauthorizedException,
  ArgumentsHost,
} from '@nestjs/common';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();

    res.redirect('/auth/login-form?error=Wrong+login+or+password!');
  }
}
