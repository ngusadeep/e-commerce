import {
  Controller,
  Post,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { LoginDto } from './dto/auth.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from './passport/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // LOGIN
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @SkipThrottle()
  @ApiBody({ type: LoginDto }) // Swagger sees the body
  async login(
    @Body() loginDto: LoginDto,
    @Request() req: { user: { user_id: string; name?: string; role?: string } },
  ) {
    // LocalStrategy attaches `req.user` internally
    return this.authService.login(req.user);
  }

  // SIGNUP
  @Post('signup')
  @SkipThrottle()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // Get current user (decoded token)
  @Post('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  me(
    @Request()
    req: {
      user?: { user_id?: string; name?: string; role?: string };
    },
  ) {
    // returns the object JwtStrategy placed on req.user
    return { user: req.user ?? null };
  }
}
