import { Module } from '@nestjs/common';
import AuthModule from 'src/components/auth/auth.module';
import AuthRenderController from './auth-render.controller';

@Module({
  imports: [AuthModule],
  controllers: [AuthRenderController],
})
export default class AuthRenderModule {}
