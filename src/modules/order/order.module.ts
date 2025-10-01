import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { User } from '../user/entities/user.entity';
import { Profile } from '../user/entities/profile.entity';
import { Category } from '../category/entities/category.entity';
import { Product } from '../product/entities/product.entity';
import { ProductService } from '../product/product.service';
import { CategoryService } from '../category/category.service';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Product, User, Profile, Category]),
    ProductModule,
    UserModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, ProductService, CategoryService],
  exports: [OrderService],
})
export class OrderModule {}
