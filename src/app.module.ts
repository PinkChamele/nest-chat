import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import AuthRenderModule from './components/auth-render/auth-render.module';
import AuthModule from './components/auth/auth.module';
import RoomsModule from './components/rooms/rooms.module';
import MessagesModule from './components/messages/messages.module';
import UsersModule from './components/users/users.module';
import RoomRenderModule from './components/room-render/room-render.module';
import configuration from './components/common/config/configuration';

@Module({
  imports: [
    UsersModule,
    MessagesModule,
    RoomsModule,
    AuthModule,
    PassportModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../public'),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('database.uri'),
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('sendgrid.host'),
          port: configService.get('sendgrid.port'),
          secure: false,
          auth: {
            user: configService.get('sendgrid.username'),
            pass: configService.get('sendgrid.apiKey'),
          },
        },
        defaults: {
          from: configService.get('sendgrid.fromEmail'),
        },
        template: {
          dir: join(__dirname, '../email_templates'), // `${process.cwd()}/src/email_templates`,
          adapter: new EjsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    AuthRenderModule,
    RoomRenderModule,
  ],
})
export default class AppModule {}
