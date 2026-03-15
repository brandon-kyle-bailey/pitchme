import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix('api/core');
  app.use(compression());
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? configService.get<string>('ALLOWED_ORIGINS')?.split(',') || []
        : true,
    credentials: true,
  });
  app.set('trust proxy', 'loopback'); // Trust requests from the loopback address

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Core API')
      .setDescription('The Core API.')
      .setVersion('1.0')
      .addTag('core')
      .addBearerAuth()
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }

  await app.listen(configService.get<string>('PORT') ?? 8080, '0.0.0.0');
}
void bootstrap();
