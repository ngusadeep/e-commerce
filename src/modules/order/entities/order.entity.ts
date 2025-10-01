import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { User } from './../../user/entities/user.entity';
import { Product } from './../../product/entities/product.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  order_id: string;

  @Column()
  total: number;

  @Column()
  ordered_on: Date;

  @CreateDateColumn()
  created_on: Date;

  @UpdateDateColumn()
  updated_on: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_on: Date;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Product, (product) => product.orders)
  @JoinTable({ name: 'order_products' })
  products: Product[];
}
