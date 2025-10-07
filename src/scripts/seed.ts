import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

import { User, RoleEnum } from '../modules/user/entities/user.entity';
import { Profile } from '../modules/user/entities/profile.entity';
import { Category } from '../modules/category/entities/category.entity';
import { Product } from '../modules/product/entities/product.entity';
import { Order } from '../modules/order/entities/order.entity';
import * as bcrypt from 'bcrypt';

function createDataSource() {
  return new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_DATABASE ?? 'postgres',
    entities: [User, Profile, Category, Product, Order],
    synchronize: false,
    logging: false,
  });
}

async function seed() {
  const ds = createDataSource();
  await ds.initialize();
  console.log('Connected to DB');

  const userRepo = ds.getRepository(User);
  const profileRepo = ds.getRepository(Profile);
  const categoryRepo = ds.getRepository(Category);
  const productRepo = ds.getRepository(Product);
  const orderRepo = ds.getRepository(Order);

  // Clear tables in safe order
  console.log('Clearing existing data...');
  await orderRepo.clear();
  await productRepo.clear();
  await categoryRepo.clear();
  await profileRepo.clear();
  await userRepo.clear();

  console.log('Seeding users...');
  const pwd = await bcrypt.hash('Password123!', 10);

  const admin = userRepo.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: pwd,
    role: RoleEnum.ADMIN,
  });
  const seller = userRepo.create({
    name: 'Seller User',
    email: 'seller@example.com',
    password: pwd,
    role: RoleEnum.SELLER,
  });
  const consumer = userRepo.create({
    name: 'Consumer User',
    email: 'consumer@example.com',
    password: pwd,
    role: RoleEnum.CONSUMER,
  });

  const savedAdmin = await userRepo.save(admin);
  const savedSeller = await userRepo.save(seller);
  const savedConsumer = await userRepo.save(consumer);

  console.log('Seeding profiles...');
  const profiles = [
    profileRepo.create({
      address: 'Admin Address',
      phone_number: '0700000001',
      bio: 'Admin profile',
      user: savedAdmin,
    }),
    profileRepo.create({
      address: 'Seller Address',
      phone_number: '0700000002',
      bio: 'Seller profile',
      user: savedSeller,
    }),
    profileRepo.create({
      address: 'Consumer Address',
      phone_number: '0700000003',
      bio: 'Consumer profile',
      user: savedConsumer,
    }),
  ];
  await profileRepo.save(profiles);

  console.log('Seeding categories and products...');
  const catElectronics = categoryRepo.create({
    name: 'Electronics',
    description: 'Gadgets and devices',
  });
  const catBooks = categoryRepo.create({
    name: 'Books',
    description: 'Printed and digital books',
  });
  await categoryRepo.save([catElectronics, catBooks]);

  const products = [
    productRepo.create({
      name: 'Smartphone',
      description: 'A smart phone',
      price: 499.99,
      category: catElectronics,
    }),
    productRepo.create({
      name: 'Laptop',
      description: 'A powerful laptop',
      price: 1299.5,
      category: catElectronics,
    }),
    productRepo.create({
      name: 'TypeScript Handbook',
      description: 'Learn TypeScript',
      price: 29.99,
      category: catBooks,
    }),
  ];
  const savedProducts = await productRepo.save(products);

  console.log('Seeding an order for consumer...');
  const order = orderRepo.create({
    total: savedProducts[0].price + savedProducts[2].price,
    ordered_on: new Date(),
    user: savedConsumer,
    products: [savedProducts[0], savedProducts[2]],
  });
  await orderRepo.save(order);

  console.log('Seeding complete');
  await ds.destroy();
}

seed()
  .then(() => {
    console.log('Seeder finished');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeder error', err);
    process.exit(1);
  });
