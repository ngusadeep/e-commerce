import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  private async hashString(str: string): Promise<string> {
    const saltRounds = 10; // Define the cost factor for hashing
    return await bcrypt.hash(str, saltRounds);
  }

  async create(createUserDto: CreateUserDto) {
    // Prevent duplicate emails
    const existing = await this.userRepository.findOne({
      where: { email: createUserDto.email },
      select: { user_id: true },
    });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    // Create and save the user
    const user = new User();
    user.name = createUserDto.name;
    user.password = await this.hashString(createUserDto.password); // encrypt password before insert
    user.email = createUserDto.email;
    const new_user = await this.userRepository.save(user);

    // Create and save the profile linked to the saved user
    const profile = new Profile();
    profile.address = createUserDto.address;
    profile.phone_number = createUserDto.phoneno;
    profile.dob = createUserDto.dob;
    profile.bio = createUserDto.bio;
    profile.user = new_user;
    await this.profileRepository.save(profile);

    return { message: 'User Created Successfully', user_Id: new_user.user_id };
  }
  async findAll(): Promise<User[]> {
    return await this.userRepository.find({ relations: { profile: true } });
  }
  async findOne(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { user_id: id },
      relations: { profile: true },
    });
  }
  async update(updateUserDto: UpdateUserDto): Promise<string> {
    const user = await this.findOne(updateUserDto.id);
    if (!user) return 'User not found';

    await this.userRepository.update(
      { user_id: updateUserDto.id },
      {
        name: updateUserDto.name,
        email: updateUserDto.email,
      },
    );
    await this.profileRepository.update(
      { user: { user_id: user.user_id } },
      {
        address: updateUserDto.address,
        dob: updateUserDto.dob,
        bio: updateUserDto.bio,
        phone_number: updateUserDto.phoneno,
      },
    );
    return 'User Updated Successfully';
  }
  async remove(id: string) {
    const user = await this.userRepository.findOne({
      where: { user_id: id },
      relations: { profile: true },
    });
    if (!user) return 'User not exists!';
    await this.profileRepository.softDelete({
      profile_id: user.profile.profile_id,
    });
    await this.userRepository.softDelete({ user_id: id });
    return 'User Deleted Successfully';
  }
  async findOneUserOrders(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { user_id: id },
      relations: { orders: { products: true } },
      select: {
        user_id: true,
        name: true,
        orders: {
          order_id: true,
          ordered_on: true,
          total: true,
          products: { product_id: true, name: true, price: true },
        },
      },
    });
  }

  /* other methods */
  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email: email },
      // Include email so callers (LocalStrategy / AuthController) can access it
      select: {
        user_id: true,
        name: true,
        email: true,
        password: true,
        role: true,
      },
    });
  }
}
