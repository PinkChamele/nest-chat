import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './components/users/users.module';
import { MessagesModule } from './components/messages/messages.module';
import { RoomsModule } from './components/rooms/rooms.module';
import { AuthModule } from './components/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { PassportModule } from '@nestjs/passport';
import { AuthRenderModule } from './components/auth-render/auth-render.module';
import { RoomRenderModule } from './components/room-render/room-render.module';

// no need variable
const url = process.env.MONGODB_URI;

@Module({
  imports: [
    UsersModule,
    MessagesModule,
    RoomsModule,
    AuthModule,
    PassportModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../src/public'),
    }),
    // Like other factory providers
    // link : https://docs.nestjs.com/techniques/mongodb
    MongooseModule.forRoot(url, { useNewUrlParser: true }),
    // use config service
    MailerModule.forRoot({
      transport: {
        host: process.env.SENDGRID_HOST,
        port: Number(process.env.SENDGRID_PORT),
        secure: false,
        auth: {
          user: process.env.SENDFRID_USERNAME,
          pass: process.env.SENDGRID_API_KEY,
        },
      },
      defaults: {
        from: process.env.SENDGRID_FROM_EMAIL,
      },
      // move views to top lvl app
      // move with public folder
      // and templates
      // rename email templates -> email_templates
      template: {
        dir: `${process.cwd()}/src/email templates`,
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    AuthRenderModule,
    RoomRenderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
