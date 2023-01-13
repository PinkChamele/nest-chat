/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
import {
  Controller,
  Post,
  UseGuards,
  Request,
  Session,
  Get,
  Body,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MailerService } from '@nestjs-modules/mailer';
import CreateUserDto from 'src/components/users/dto/create-user.dto';
import UsersService from 'src/components/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ApiExtraModels } from '@nestjs/swagger';
import LoginGuard from '../common/guards/login.gurad';
import AuthService from './auth.service';
import { User } from '../users/schemas/users.schema';

@Controller({
  path: 'auth',
  version: '1',
})
@ApiExtraModels(User)
export default class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() req, @Session() session: Record<string, any>) {
    session.user = req.user;
    return req.user;
  }

  @Post('send-reset-email')
  async resetPassword(@Body() body) {
    const { email } = body;
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException();
    }

    const token = this.jwtService.sign(
      { email: user.email },
      { expiresIn: '1h' },
    );

    await this.mailerService.sendMail({
      to: email,
      from: this.configService.get('sendgrid.fromEmail'),
      subject: 'Confirm reset password',
      template: './reset-password',
      context: {
        token,
        email,
        // host: this.configService.get('host'),
      },
    });
  }

  @Post('confirm-password-reset')
  async confirmPasswordReset(@Body() { token, new_password: newPassword }) {
    try {
      const payload = this.jwtService.verify(token);

      if (payload) {
        this.usersService.updatePasswordByEmail(payload.email, newPassword);
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.register(createUserDto);
  }

  @Post('logout')
  async logout(@Request() req) {
    this.authService.logout(req.session);
  }

  @Get('self')
  @UseGuards(LoginGuard)
  async self(@Session() session: Record<string, any>) {
    return session.user;
  }
}
