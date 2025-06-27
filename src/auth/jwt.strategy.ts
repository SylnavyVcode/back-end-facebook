import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
// import { jwtConstants } from './constants';

export type UserPayload = { user_id: string };
export type RequestWith = { user: UserPayload };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate({ user_id }: UserPayload) {
    // Ici, vous pouvez ajouter une logique pour vérifier si l'utilisateur existe dans la base de données
    console.log('Validating user with ID:', user_id);

    return { user_id };
  }
}
