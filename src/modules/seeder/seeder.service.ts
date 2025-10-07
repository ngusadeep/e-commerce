import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, RoleEnum } from '../user/entities/user.entity';
import { Profile } from '../user/entities/profile.entity';
import { Category } from '../category/entities/category.entity';
import { Product } from '../product/entities/product.entity';
import { Order } from '../order/entities/order.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
  ) {}

  async onModuleInit() {
    try {
      this.logger.log('Running database seeder (idempotent)...');
      await this.seed();
      this.logger.log('Seeder finished');
    } catch (err) {
      this.logger.error('Seeder failed', err);
    }
  }

  private async seed() {
    const pwd = await bcrypt.hash('Password123!', 10);

    // Upsert users by email
    const usersToEnsure = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        role: RoleEnum.ADMIN,
      },
      {
        name: 'Seller User',
        email: 'seller@example.com',
        role: RoleEnum.SELLER,
      },
      {
        name: 'Consumer User',
        email: 'consumer@example.com',
        role: RoleEnum.CONSUMER,
      },
    ];

    const savedUsers: Record<string, User> = {};
    for (const u of usersToEnsure) {
      let existing = await this.userRepo.findOne({ where: { email: u.email } });
      if (!existing) {
        const created = this.userRepo.create({
          name: u.name,
          email: u.email,
          password: pwd,
          role: u.role,
        });
        existing = await this.userRepo.save(created);
        this.logger.log(`Created user ${u.email}`);
      } else {
        this.logger.log(`User ${u.email} already exists`);
      }
      savedUsers[u.email] = existing;
    }

    // Ensure profiles exist for users
    for (const email of Object.keys(savedUsers)) {
      const usr = savedUsers[email];
      const hasProfile = await this.profileRepo.findOne({
        where: {
          user: { user_id: usr.user_id },
        },
      });
      if (!hasProfile) {
        const profile = this.profileRepo.create({
          address: `${usr.name} Address`,
          phone_number: '0700000000',
          bio: `${usr.name} profile`,
          user: usr,
        });
        await this.profileRepo.save(profile);
        this.logger.log(`Created profile for ${email}`);
      }
    }

    // Upsert categories
    const categoriesToEnsure = [
      { name: 'Electronics', description: 'Gadgets and devices' },
      { name: 'Books', description: 'Printed and digital books' },
    ];
    const savedCategories: Record<string, Category> = {};
    for (const c of categoriesToEnsure) {
      let existing = await this.categoryRepo.findOne({
        where: { name: c.name },
      });
      if (!existing) {
        existing = await this.categoryRepo.save(this.categoryRepo.create(c));
        this.logger.log(`Created category ${c.name}`);
      }
      savedCategories[c.name] = existing;
    }

    // Upsert products by name
    const productsToEnsure = [
      {
        name: 'Smartphone',
        description: 'A smart phone',
        price: 499.99,
        category: 'Electronics',
      },
      {
        name: 'Laptop',
        description: 'A powerful laptop',
        price: 1299.5,
        category: 'Electronics',
      },
      {
        name: 'TypeScript Handbook',
        description: 'Learn TypeScript',
        price: 29.99,
        category: 'Books',
      },
    ];
    const savedProducts = [] as Product[];
    for (const p of productsToEnsure) {
      let existing = await this.productRepo.findOne({
        where: { name: p.name },
        relations: ['category'],
      });
      if (!existing) {
        const prod = this.productRepo.create({
          name: p.name,
          description: p.description,
          price: p.price,
          category: savedCategories[p.category],
        });
        existing = await this.productRepo.save(prod);
        this.logger.log(`Created product ${p.name}`);
      }
      savedProducts.push(existing);
    }

    // Create an order for consumer if none exists
    const consumer = savedUsers['consumer@example.com'];
    const consumerOrders = await this.orderRepo.find({
      where: { user: { user_id: consumer.user_id } },
      relations: ['products'],
    });
    if (consumerOrders.length === 0) {
      // Ensure numeric addition (Product.price may be a string from DB decimal)
      const price0 = Number(savedProducts[0].price);
      const price2 = Number(savedProducts[2].price);
      const order = this.orderRepo.create({
        total: price0 + price2,
        ordered_on: new Date(),
        user: consumer,
        products: [savedProducts[0], savedProducts[2]],
      });
      await this.orderRepo.save(order);
      this.logger.log('Created sample order for consumer');
    } else {
      this.logger.log('Consumer already has orders, skipping order creation');
    }
  }
}
