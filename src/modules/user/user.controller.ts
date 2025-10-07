import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationPipe } from '@nestjs/common';
import { ParseUUIDPipe } from './../../config/custom/parse-uuid.pipe';
import { Roles } from '../auth/role.decorator';
import { RoleEnum } from './../user/entities/user.entity';
import { JwtAuthGuard } from '../auth/passport/jwt.guard';
import { RolesGuard } from '../auth/role.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT')
@Roles(RoleEnum.ADMIN)
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(RoleEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.SELLER)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }
  @Put()
  async update(@Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(updateUserDto);
  }
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }
  @Get('userorders/:id')
  async findOneUserOrders(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOneUserOrders(id);
  }
}
