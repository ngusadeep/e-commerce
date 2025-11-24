import {
  Column,
  Entity,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Order } from './../../order/entities/order.entity';
import type { Category } from './../../category/entities/category.entity';
@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  product_id: string;
  @Column()
  name: string;

  @Column()
  description: string;
  @Column({
    type: 'decimal',
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  price: number;
  @CreateDateColumn()
  createdon: Date;

  @UpdateDateColumn()
  updatedon: Date;

  @DeleteDateColumn()
  deletedon: Date;
  @ManyToMany('Order', (order: Order) => order.products)
  orders: Order[];

  @ManyToOne('Category', (category: Category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
