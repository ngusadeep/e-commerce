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
@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
