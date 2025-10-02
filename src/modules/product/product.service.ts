import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

import { CategoryService } from '../category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoryService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryService.findOne(
      createProductDto.categoryId,
    );
    if (!category) {
      return 'Category not found';
    }
    const newProduct = new Product(); // Creating a product object to initialize its values
    newProduct.name = createProductDto.name;
    newProduct.description = createProductDto.description;
    newProduct.price = createProductDto.price;
    newProduct.category = category; // Directly assign the found category
    await this.productRepository.insert(newProduct); // insert the new product in the product table
    return 'Product created successfully';
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }
  async findOne(id: string): Promise<Product | null> {
    return await this.productRepository.findOneBy({ product_id: id }); //returning a specific product
  }
  async update(updateProductDto: UpdateProductDto) {
    const product = await this.findOne(updateProductDto.id);
    if (!product) {
      return 'Product not found';
    }
    await this.productRepository.update(updateProductDto.id, updateProductDto);
    return 'Product updated successfully!';
  }

  async remove(id: string): Promise<string> {
    await this.productRepository.softDelete({ product_id: id }); // Mark as Deleted the product if exists, Does not check if entity exist in the database.
    /*
      the soft delete will not delete the object in table but it will make that object has been deleted by adding the date in deleted_on column. here we can retrive the value if needed.
                                    OR
      the delete will delete entire object from table and can't be retrived back
      */
    return 'Product deleted successfully';
  }
}
