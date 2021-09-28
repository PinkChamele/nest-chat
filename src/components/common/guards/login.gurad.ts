/* eslint-disable class-methods-use-this */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

function validateRequest(request: any): boolean {
  if (request.session.user) {
    return true;
  }
  throw new UnauthorizedException();
}

@Injectable()
export default class LoginGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
