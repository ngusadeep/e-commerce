import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER } from '@nestjs/core';
import { UserModule } from './../user/user.module';
import { jwtConstants } from './passport/jwt.constants';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtStrategy } from './passport/jwt.strategy';
import { JwtExpiredFilter } from './passport/jwtExpired.filter';
import { JwtAuthGuard } from './passport/jwt.guard';
import { RolesGuard } from './role.guard';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expirationTime },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    {
      provide: APP_FILTER,
      useClass: JwtExpiredFilter,
    },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
