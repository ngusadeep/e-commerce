import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from './../user/entities/user.entity';

export const Roles = (...roles: RoleEnum[]) => SetMetadata('roles', roles);
