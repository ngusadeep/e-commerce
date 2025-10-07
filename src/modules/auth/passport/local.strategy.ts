import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' }); // Default is 'username'
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (user === null) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Return a minimal safe user object for placing on req.user
    return {
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
