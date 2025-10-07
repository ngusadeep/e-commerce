import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from './../user/entities/user.entity';
import { Request } from 'express';

interface AuthenticatedUser {
  role: RoleEnum;
  userId: number;
  email: string;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const skipGuard = this.reflector.get<boolean>(
      'skipAuthGuard',
      context.getHandler(),
    );
    if (skipGuard) {
      return true;
    }

    // Check roles metadata on the handler first, then the class (controller)
    const roles =
      this.reflector.get<RoleEnum[]>('roles', context.getHandler()) ||
      this.reflector.get<RoleEnum[]>('roles', context.getClass());

    // If no roles metadata is present, allow access
    if (!roles || roles.length === 0) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthenticatedUser }>();
    const user = request.user;

    // If there's no authenticated user on the request, throw 401 so it's clear
    if (!user) throw new UnauthorizedException('Missing authentication');

    const allowed = roles.some((role) => user.role === role);
    if (!allowed) {
      // Optionally, could log here: console.debug('Access denied - user role:', user.role, 'required:', roles);
    }
    return allowed;
  }
}
