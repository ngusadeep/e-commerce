import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './config/allexceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonLogger } from './config/winston.logger';
import { ValidationPipe } from '@nestjs/common';
dotenv.config({ path: process.cwd() + `/.env.${process.env.NODE_ENV}` });
//                                OR
// dotenv.config({ path: process.cwd() + `/${process.env.NODE_ENV}.env` });
/*
  the cmd method will return the current working directory of the Node.js process.
 .env.development is a file which i am using to storing environmental variables.
 if you are using normal .env file, the above import and config steps are not required.
*/ async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // Applies validation globally
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') ?? 4000;
  app.use(cookieParser());
  const apiPrefix = '/api/v1';
  app.setGlobalPrefix(apiPrefix, { exclude: ['/'] });
  app.useGlobalFilters(new AllExceptionsFilter());
  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('app.name') || 'Default App Name')
    .setDescription(
      configService.get<string>('app.description') || 'Default App Description',
    )
    .setVersion(configService.get<string>('app.version') || '1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
        description:
          'Enter the JWT token **without** the `Bearer ` prefix. Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`',
      },
      'JWT', // This name ('JWT') should match the @ApiBearerAuth() usage in controllers
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document); // ✅ move above listen()

  await app.listen(port); // ✅ must be last
  // Logging the application URL to confirm successful startup
  const logger = new WinstonLogger();
  const appUrl = await app.getUrl();
  logger.info(`Application is running on: ${appUrl}`);
}
void bootstrap();
