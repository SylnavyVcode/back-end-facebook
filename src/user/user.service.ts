import { Injectable, NotFoundException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
// import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // Récupérer un utilisateur par son ID
  async getUser(id: string) {
    console.log('>>>>>>>>>>>', id);

    const account = await this.prisma.account.findUnique({
      where: { id },
    });

    if (!account) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const user = await this.prisma.user.findUnique({
      where: { id: account?.user_id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const data = {
      id: account.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      telephone: user.telephone!,
      genre: user.genre,
      anniversaire: user.anniversaire,
      profilePic: user.profilePic,
      profilCoverPic: user.profilCoverPic,
      password: account.password,
      type_account: account.type_account,
    };
    console.log(data);

    return data;
  }

  // Récupérer tous les utilisateurs (optionnel : pagination)
  async getAllUsers() {
    const account = await this.prisma.account.findMany({});
    const data = [];
    if (account) {
      for (const element of account) {
        const user = await this.prisma.user.findUnique({
          where: { id: element.user_id },
        });
        if (user) {
          const model = {
            id: element.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            telephone: user.telephone!,
            genre: user.genre,
            anniversaire: user.anniversaire,
            profilePic: user.profilePic,
            profilCoverPic: user.profilCoverPic,
            password: element.password,
            type_account: element.type_account,
          };
          data.push(model);
        }
      }
    }
    return data;
  }

  // Mettre à jour un utilisateur
  async updateUser(id: string, data: UpdateUserDto) {
    const resp_account = await this.prisma.account.findUnique({
      where: { id },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: resp_account?.user_id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    let resp_user = {} as any;
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
      resp_user = await this.prisma.account.update({
        where: { id },
        data,
      });
    } else {
      resp_user = await this.prisma.user.update({
        where: { id },
        data,
      });
    }

    return resp_user;
  }

  // Supprimer un utilisateur
  async deleteUser(id: string) {
    const resp_account = await this.prisma.account.findUnique({
      where: { id },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: resp_account?.user_id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.prisma.user.delete({ where: { id: resp_account?.user_id } });
    await this.prisma.account.delete({ where: { id } });
  }
}
