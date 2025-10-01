import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { Order } from '../order/entities/order.entity';
import { OrderService } from '../order/order.service';
import { ProductModule } from '../product/product.module';
@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Order]), ProductModule],
  controllers: [UserController],
  providers: [UserService, OrderService],
  exports: [UserService],
})
export class UserModule {}
