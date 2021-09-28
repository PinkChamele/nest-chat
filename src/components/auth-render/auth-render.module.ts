import { Module } from '@nestjs/common';
import AuthModule from 'src/components/auth/auth.module';
import UsersModule from 'src/components/users/users.module';
import AuthRenderController from './auth-render.controller';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [AuthRenderController],
})
export default class AuthRenderModule {}
