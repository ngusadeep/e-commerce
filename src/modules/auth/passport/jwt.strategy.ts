import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { Request } from 'express';
import { jwtConstants } from './jwt.constants';

// Define a type-safe JWT payload interface
interface JwtPayload {
  sub: number | string; // user id
  name?: string;
  role?: string;
  email?: string;
  // Add other fields if present in your JWT
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true, // validate receives req as first param
    } as StrategyOptionsWithRequest);
  }

  validate(req: Request, payload: JwtPayload) {
    // Return a user object consistent with LocalStrategy so RolesGuard can read role
    return {
      user_id: payload.sub,
      name: payload.name,
      role: payload.role,
      email: payload.email,
    };
  }
}
