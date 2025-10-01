import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const new_category = new Category();
    new_category.name = createCategoryDto.name;
    new_category.description = createCategoryDto.description;
    const category = await this.categoryRepository.save(new_category);
    return {
      message: 'Category created successfully',
      category_id: category.category_id,
    };
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async findOne(id: string): Promise<Category | null> {
    return await this.categoryRepository.findOneBy({ category_id: id });
  }

  async update(updateCategoryDto: UpdateCategoryDto): Promise<string> {
    const category = await this.categoryRepository.findOneBy({
      category_id: updateCategoryDto.id,
    });
    if (!category) {
      return 'Category not found';
    }
    await this.categoryRepository.update(
      updateCategoryDto.id,
      updateCategoryDto,
    );
    return 'Category updated succesfully';
  }

  async remove(id: string): Promise<string> {
    const category = await this.categoryRepository.findOneBy({
      category_id: id,
    });
    if (!category) {
      return 'Category not found';
    }
    await this.categoryRepository.softDelete({ category_id: id });
    return 'Category deleted succesfully!';
  }
}
