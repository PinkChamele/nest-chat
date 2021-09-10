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
import { AuthService } from 'src/components/auth/auth.service';
import { UnauthorizedExceptionFilter } from './filters/relogin.filter';
import { CreateUserDto } from 'src/components/users/dto/create-user.dto';
import { SendEmailDto } from './dto/send-email.dto';

@Controller('auth')
export class AuthRenderController {
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
    res.redirect('/room/');
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
    res.redirect('/auth/login-form/');
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res) {
    // 1. business logic
    // 2. redirect
    res.redirect('/auth/login-form/');
    return this.authService.register(createUserDto);
  }

  @Get('forgot-password')
  @Render('./password-reset/forgot-password')
  async sendResetEmail() {
    return;
  }

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
