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
import { Order } from './../../order/entities/order.entity';
import { Category } from './../../category/entities/category.entity';
@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  product_id: string;
  @Column()
  name: string;

  @Column()
  description: string;
  @Column({ type: 'decimal' })
  price: number;
  @CreateDateColumn()
  createdon: Date;

  @UpdateDateColumn()
  updatedon: Date;

  @DeleteDateColumn()
  deletedon: Date;
  @ManyToMany(() => Order, (order) => order.products)
  orders: Order[];

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
