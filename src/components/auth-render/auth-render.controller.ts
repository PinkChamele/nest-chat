/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import {
  Controller,
  Get,
  Post,
  Query,
  Render,
  Res,
  Body,
  Session,
  UseFilters,
  UseGuards,
  Request,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import AuthService from 'src/components/auth/auth.service';
import CreateUserDto from 'src/components/users/dto/create-user.dto';
import UnauthorizedExceptionFilter from '../common/filters/relogin.filter';
import SendEmailDto from './dto/send-email.dto';

@Controller('auth-render')
export default class AuthRenderController {
  constructor(private readonly authService: AuthService) {}

  @Get('login-form')
  @Render('./auth/login')
  loginForm(@Query('error') error) {
    return { error };
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  @UseFilters(UnauthorizedExceptionFilter)
  async login(
    // @SessionUser() user
    @Request() req,
    @Session() session: Record<string, any>,
    @Res() res,
  ) {
    if (!req.user) {
      throw new UnauthorizedException();
    }
    session.user = req.user;
    res.redirect('/room-render/');
    return req.user;
  }

  @Get('register-form')
  @Render('./auth/register')
  registerForm(@Query('error') error) {
    return { error };
  }

  @Post('logout')
  async logout(@Res() res, @Req() req) {
    await this.authService.logout(req.session);
    res.redirect('/auth-render/login-form/');
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res) {
    const newUser = await this.authService.register(createUserDto);

    res.redirect('/auth-render/login-form/');
    return newUser;
  }

  @Get('forgot-password')
  @Render('./password-reset/forgot-password')
  async sendResetEmail() {}

  @Post('email-send')
  @Render('./password-reset/email-sent')
  async emailSent(@Body() { email }: SendEmailDto) {
    this.authService.resetPassword(email);
    return { email };
  }

  @Get('reset-password-form')
  @Render('./password-reset/reset-password-form')
  passwordResetForm(@Query('token') token) {
    return { token };
  }
}
