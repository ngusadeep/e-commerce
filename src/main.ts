import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonLogger } from './config/winston.logger';

dotenv.config({ path: process.cwd() + `/.env.${process.env.NODE_ENV}` });
//                                OR
// dotenv.config({ path: process.cwd() + `/${process.env.NODE_ENV}.env` });
/*
  the cmd method will return the current working directory of the Node.js process.
 .env.development is a file which i am using to storing environmental variables.
 if you are using normal .env file, the above import and config steps are not required.
*/ async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') ?? 4000;

  const apiPrefix = '/api/v1';
  app.setGlobalPrefix(apiPrefix, { exclude: ['/'] });

  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('app.name') || 'Default App Name')
    .setDescription(
      configService.get<string>('app.description') || 'Default App Description',
    )
    .setVersion(configService.get<string>('app.version') || '1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document); // ✅ move above listen()

  await app.listen(port); // ✅ must be last
  // Logging the application URL to confirm successful startup
  const logger = new WinstonLogger();
  const appUrl = await app.getUrl();
  logger.info(`Application is running on: ${appUrl}`);
}
bootstrap();
