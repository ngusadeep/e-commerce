import type { User } from './user.entity';
import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  profile_id: string;

  @Column({ nullable: true })
  dob?: Date;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ nullable: true })
  address: string;

  @Column()
  phone_number: string;

  @CreateDateColumn()
  created_on: Date;

  @UpdateDateColumn()
  updated_on: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_on: Date;
  @OneToOne('User', (user: User) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
