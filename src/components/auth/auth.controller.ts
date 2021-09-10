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
import { CreateUserDto } from 'src/components/users/dto/create-user.dto';
import { UsersService } from 'src/components/users/users.service';
import { LoginGuard } from './guards/login.gurad';
import { JwtService } from '@nestjs/jwt';

@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() req, @Session() session: Record<string, any>) {
    session.user = req.user;
    return req.user;
  }

  @Post('send-reset-email')
  async resetPassword(@Body() { email }) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException();
    }

    const token = this.jwtService.sign(
      { email: user.email },
      { expiresIn: '1h' },
    );

    // wait promise or catch errors
    this.mailerService.sendMail({
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Confirm reset password',
      template: './reset-password',
      context: {
        token,
        email,
        host: process.env.HOST_NAME,
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
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('logout')
  async logout(@Request() req) {
    req.session.destroy(null);
  }

  @Get('self')
  @UseGuards(LoginGuard)
  async self(@Session() session: Record<string, any>) {
    return session.user;
  }
}
