import * as session from 'express-session';
import { join } from 'path';

import { NestApplication, NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import AppModule from './app.module';
import AllExceptionsFilter from './components/common/filters/all-exceptions.filter';
// import ValidationExceptionFilter from './components/common/filters/bad-request-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);
  const configService = app.get(ConfigService);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  // app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    // new ValidationExceptionFilter(),
  );
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

  const config = new DocumentBuilder().setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(configService.get('port'));
}
bootstrap();
