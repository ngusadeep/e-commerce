// user.entity.ts
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Profile } from './profile.entity';
import type { Order } from 'src/modules/order/entities/order.entity';

export enum RoleEnum {
  ADMIN = 'ADMIN',
  SELLER = 'SELLER',
  CONSUMER = 'CONSUMER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  // generated specifies if this column will use auto increment (sequence, generated identity, rowid
  user_id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @CreateDateColumn()
  created_on: Date;

  @UpdateDateColumn()
  updated_on: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_on: Date;
  @OneToOne('Profile', (profile: Profile) => profile.user)
  profile: Profile;

  @OneToMany('Order', (order: Order) => order.user)
  orders: Order[];

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.CONSUMER,
  })
  role: RoleEnum;
}
