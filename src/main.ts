import * as session from 'express-session';
import { join } from 'path';

import { NestApplication, NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import AppModule from './app.module';
import AllExceptionsFilter from './components/common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);
  const configService = app.get(ConfigService);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalFilters(new AllExceptionsFilter());
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.use(
    session({
      secret: configService.get('session.secret'),
      resave: false,
      saveUninitialized: false,
    }),
  );
  await app.listen(configService.get('port'));
}
bootstrap();
