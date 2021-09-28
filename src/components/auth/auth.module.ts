import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import LocalStrategy from './local.strategy';
import AuthService from './auth.service';
import UsersModule from '../users/users.module';
import AuthController from './auth.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    MailerModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export default class AuthModule {}
