import {
  ConflictException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from 'src/user/dto/CreateUserDto';

import * as bcrypt from 'bcrypt';
import { signInDto } from './dto/signInDto';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './jwt.strategy';
import { resetPasswordDemandDto } from './dto/ressetPasswordDemandeDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  // Création d'un utilisateur
  async register(data: CreateUserDto) {
    console.log('>>>>>>>data', data);

    const user_find = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (user_find) {
      throw new ConflictException('Un compte existe déjà à cet adresse.');
    }

    const hashPassword: string = await this.hashPassword({
      password: data.password,
    });

    const resp = await this.prisma.user.create({
      data: {
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        telephone: data.telephone!,
        genre: data.genre,
        anniversaire: data.anniversaire,
        profilePic: data.profilePic,
        profilCoverPic: data.profilCoverPic,
      },
    });

    if (resp) {
      const resp_account = await this.prisma.account.create({
        data: {
          password: hashPassword,
          user_id: resp.id,
          type_account: 'PUBLIC',
        },
      });
      return this.authentificateUser({ user_id: resp_account.id });
      // return resp_account;
    }
  }

  // Connexion
  async login(data: signInDto) {
    const user_find = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user_find) {
      throw new Error("L'utilisateur n'existe pas .");
    }

    const account = await this.prisma.account.findUnique({
      where: { user_id: user_find.id },
    });

    if (account) {
      const comparePassword = await this.isPasswordValid({
        password: data.password,
        hashPassword: account.password,
      });

      if (!comparePassword) {
        throw new Error('Le mot de passe est invalid.');
      }
      return this.authentificateUser({ user_id: user_find.id });
    }
  }

  // hash password
  private async hashPassword({ password }: { password: string }) {
    const hashPass = await bcrypt.hash(password, 10);
    return hashPass;
  }

  // hash password
  private async isPasswordValid({
    password,
    hashPassword,
  }: {
    password: string;
    hashPassword: string;
  }) {
    const isPasswordValid = await bcrypt.compare(password, hashPassword);
    return isPasswordValid;
  }

  // hash password
  private async authentificateUser({ user_id }: UserPayload) {
    const payload: UserPayload = { user_id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  // reset password
  async resetPassword(resetPasswordDto: resetPasswordDemandDto) {
    const { email } = resetPasswordDto;
    const user_find = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (!user_find)
      throw new NotAcceptableException('Aucun utilisateur trouvé');
    
  }
}
