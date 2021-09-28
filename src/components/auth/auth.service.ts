/* eslint-disable class-methods-use-this */
import { Injectable, NotFoundException } from '@nestjs/common';
import UsersService from 'src/components/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/components/users/schemas/users.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import CreateUserDto from 'src/components/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findOneByEmailWithPassword(email);
    const check = await bcrypt.compare(password, user.password);

    if (check) {
      delete user.password;
      return user;
    }
    return null;
  }

  async resetPassword(email) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException();
    }

    const token = this.jwtService.sign(
      { email: user.email },
      { expiresIn: '1h' },
    );

    this.mailerService.sendMail({
      to: email,
      from: this.configService.get('sendgrid.fromEmail'),
      subject: 'Confirm reset password',
      template: './reset-password',
      context: {
        token,
        email,
        host: this.configService.get('host'),
      },
    });
  }

  async register(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  async logout(session) {
    session.destroy(null);
  }
}
