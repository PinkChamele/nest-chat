import * as dotenv from 'dotenv';
import * as session from 'express-session';
// move to body
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

// add https://github.com/nestjs/nest/tree/master/sample/10-fastify/src/common
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setBaseViewsDir(join(__dirname, '..', 'src/views'));
  app.setViewEngine('ejs');
  app.useStaticAssets(join(__dirname, '..', 'src/public'));
  app.use(
    session({
      // process env
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
