import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { User } from './modules/user/entities/user.entity';
import { Product } from './modules/product/entities/product.entity';
import { Category } from './modules/category/entities/category.entity';
import { Order } from './modules/order/entities/order.entity';
import { Profile } from './modules/user/entities/profile.entity';
import { CategoryModule } from './modules/category/category.module';
import { OrderModule } from './modules/order/order.module';
import { AuthModule } from './modules/auth/auth.module';
import { minutes, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler';
import { SeederModule } from './modules/seeder/seeder.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    AppConfigModule,
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: minutes(1),
        limit: 100,
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE ?? process.env.DATABASE,
      synchronize: process.env.DB_SYNC == 'true',
      autoLoadEntities: true,
      entities: [User, Product, Category, Order, Profile],
      //Logger setings to log error's and warn's in the ORM.
      logger: 'file',
      logging: ['error'],
    }),
    ProductModule,
    UserModule,
    CategoryModule,
    OrderModule,
    AuthModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
