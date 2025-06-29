import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';

const jwtService = new JwtService({
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: 2048, // 2 days
  },
});
/**
 * @author Sylnavy Valmy MABIKA
 * @description Classe utilitaire pour la gestion des tokens JWT.
 * @version 0.0.1
 */
export class Token {
  /**
   * creation d'un token
   * @param data donnée de type string ou object qui va etre contenue
   * dans le token.
   * @description
   * Cette méthode crée un token JWT à partir des données fournies.
   * @returns {string}
   */
  static create(data: string): any {
    try {
      const resp = jwtService.signAsync(data);
      if (resp) {
        return resp;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  }

  /**
   * @param {string} token
   * @description
   * Cette méthode décode un token JWT et retourne le payload ou false en cas d'er
   * @returns
   */
  static decode(token: string): JwtPayload | string | boolean {
    try {
      const resp = jwtService.decode(token);
      if (resp) {
        return resp;
      } else {
        return false;
      }
    } catch (error) {
      return { code: 401, status: 'not_authorized' };
    }
  }
}
