import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateLikeDto } from './dto/CreateLikeDto';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}

  // creation d'un like
  async postLike(data: CreateLikeDto) {
    console.log('>>>>>>>>>>>', data);

    const like = await this.prisma.like.create({
      data: {
        user_id: data?.user_id ?? '',
        post_id: data?.post_id ?? '',
        comment_id: data?.comment_id ?? '',
      },
    });

    if (!like) {
      throw new NotFoundException(`like with ID ${like} not found`);
    }

    return like;
  }

  // Récupérer un utilisateur par son ID
  async getLike(id: string) {
    console.log('>>>>>>>>>>>', id);

    const like = await this.prisma.like.findUnique({
      where: {
        id: id,
      },
    });

    if (!like) {
      throw new NotFoundException(`like with ID ${id} not found`);
    }

    return like;
  }

  // Récupérer tous les utilisateurs (optionnel : pagination)
  async getAllLikes() {
    const like = await this.prisma.like.findMany({});
    console.log('>>>>>>all like)===', like);

    return like;
  }

  // Supprimer un utilisateur
  async deleteLike(id: string) {
    const resp_like = await this.prisma.like.findUnique({
      where: { id },
    });

    const deletelike = await this.prisma.like.delete({
      where: { id: resp_like?.user_id },
    });

    if (!deletelike) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return deletelike;
  }
}
