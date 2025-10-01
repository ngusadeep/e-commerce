import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = new Product();
    newProduct.name = createProductDto.name;
    newProduct.description = createProductDto.description;
    newProduct.price = createProductDto.price;
    return await this.productRepo.save(newProduct);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepo.find();
  }
  async findOne(id: string): Promise<Product | null> {
    return await this.productRepo.findOneBy({ product_id: id }); //returning a specific product
  }
  async update(updateProductDto: UpdateProductDto): Promise<string> {
    await this.productRepo.update(updateProductDto.id, updateProductDto);
    return 'Product updated successfully!';
  }
  async remove(id: string): Promise<string> {
    await this.productRepo.delete({ product_id: id }); //deleting the product
    return 'Product deleted successfully';
  }
}
