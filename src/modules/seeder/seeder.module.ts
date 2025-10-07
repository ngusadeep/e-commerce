import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { User } from '../user/entities/user.entity';
import { Profile } from '../user/entities/profile.entity';
import { Category } from '../category/entities/category.entity';
import { Product } from '../product/entities/product.entity';
import { Order } from '../order/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, Category, Product, Order]),
  ],
  providers: [SeederService],
})
export class SeederModule {}
