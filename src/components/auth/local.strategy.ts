import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/components/users/schemas/users.schema';
import { validate } from 'class-validator';
import AuthService from './auth.service';
import TransformValidationErrors from '../common/functions/transform-validation-errors';

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    // const errors = await validate(new SignInDto(req.body));

    // if (errors.length > 0) {
    //   throw TransformValidationErrors(errors);
    // }

    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
