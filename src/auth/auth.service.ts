import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from 'src/user/dto/CreateUserDto';

import * as bcrypt from 'bcrypt';
import { signInDto } from './dto/signInDto';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './jwt.strategy';
import { resetPasswordDemandDto } from './dto/ressetPasswordDemandeDto';
import { generateCodeOTP } from 'src/utils/generateCodeOTP';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}
  // Création d'un utilisateur
  async register(data: CreateUserDto) {
    console.log('>>>>>>>data', data);

    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (user) {
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
      this.emailService.sendEmail(
        data.email,
        'Votre compte a été créé avec succès',
        `${data.firstname} félicitation votre compte a été créé avec succès.`,
      );
      return this.authentificateUser({ user_id: resp_account.id });
      // return resp_account;
    }
  }

  // Connexion
  async login(data: signInDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      throw new Error("L'utilisateur n'existe pas .");
    }

    const account = await this.prisma.account.findUnique({
      where: { user_id: user.id },
    });

    if (account) {
      const comparePassword = await this.comparePasswords({
        password: data.password,
        hashedPassword: account.password,
      });

      if (!comparePassword) {
        throw new Error('Le mot de passe est invalid.');
      }
      return this.authentificateUser({ user_id: user.id });
    }
  }

  // resetPasswordRequest
  async resetPasswordRequest({ email }: { email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      return {
        code: 400,
        status: 'Echec',
        message: "L'utilisateur n'existe pas .",
      };
    }

    const account = await this.prisma.account.findUnique({
      where: { user_id: user.id },
    });
    if (!account)
      throw new NotFoundException('Compte introuvable pour cet utilisateur.');

    if (account.isResetingPassword) {
      return {
        code: 400,
        status: 'Echec',
        message: 'Une demande de réinitialisation est déjà en cours.',
      };
      // throw new Error('Une demande de réinitialisation est déjà en cours.')
    }
    const code = generateCodeOTP();
    await this.prisma.account.update({
      where: { id: account.id },
      data: {
        isResetingPassword: true,
        resetPasswordToken: code,
      },
    });

    await this.emailService.sendEmail(
      email,
      'Réinitialisation de mot de passe',
      `${user.firstname}, votre code de réinitialisation est : ${code}`,
    );

    return {
      code: 200,
      status: 'success',
      message: 'Code envoyé. Veuillez consulter vos emails pour réinitialiser.',
    };
  }

  // resetPasswordRequest
  async resetPasswordValidation({ token }: { token: string }) {
    console.log('token ========', token);

    const account = await this.prisma.account.findUnique({
      where: { resetPasswordToken: token },
    });
    console.log('account', account);
    if (!account) {
      return {
        code: 400,
        status: 'Echec',
        message: "Le token n'est pas valide!",
      };
    }
    if (account!.isResetingPassword === false) {
      return {
        code: 400,
        status: 'Echec',
        message: "Il n'y a pas de demande de réinitiation encours!",
      };
      // throw new Error('Une demande de réinitialisation est déjà en cours.')
    }

    return {
      code: 200,
      status: 'success',
      message: 'Le torken est valide et peut donc etre utilisé.',
    };
  }

  async confirmPasswordReset(token: string, newPassword: string) {
    const account = await this.prisma.account.findFirst({
      where: { resetPasswordToken: token, isResetingPassword: true },
    });
    if (!account) throw new BadRequestException('Token invalide.');

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.account.update({
      where: { id: account.id },
      data: {
        password: hashed,
        resetPasswordToken: null,
        isResetingPassword: false,
      },
    });
    return {
      code: 200,
      status: 'success',
      message: 'Mot de passe réinitialisé.',
    };
  }

  // Compare passwords
  async comparePasswords({
    password,
    hashedPassword,
  }: {
    password: string;
    hashedPassword: string;
  }): Promise<boolean> {
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

  // reset password DISCONNECT
  async resetPasswordAccountDisconnet(
    resetPasswordDto: resetPasswordDemandDto,
  ) {
    const { email } = resetPasswordDto;
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });
    console.log('esponse fond', user);

    if (!user) throw new NotAcceptableException('Aucun utilisateur trouvé');
    return generateCodeOTP();
  }
  // reset password OONNECT
  async resetPasswordAccountConnect({ user_id }: { user_id: string }) {
    const user = await this.prisma.account.findUnique({
      where: { id: user_id },
    });
    console.log('esponse fond', user);

    if (!user) throw new NotAcceptableException('Aucun utilisateur trouvé');
    return generateCodeOTP();
  }
}
