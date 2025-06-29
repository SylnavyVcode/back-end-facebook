import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './jwt.strategy';
import * as bcrypt from 'bcrypt';

export class AuthUtils {
  constructor(private readonly jwtService: JwtService) {}

  // Compare passwords
  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
  // hash password
  async hashPassword({ password }: { password: string }) {
    const hashPass = await bcrypt.hash(password, 10);
    return hashPass;
  }

  /**
   * @description
   * Cette méthode authentifie l'utilisateur en générant un token JWT.
   * @param {UserPayload} user_id - L'identifiant de l'utilisateur.
   * @return {Promise<{ access_token: string }>} - Un objet contenant le token d'accès.
   */

  async authentificateUser({ user_id }: UserPayload) {
    const payload: UserPayload = { user_id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
