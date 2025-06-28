import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class LikeService {
  
    constructor(private readonly prisma: PrismaService) {}
  
    // creation d'un like
    async postLike(data: CreateLikeDto) {
      console.log('>>>>>>>>>>>', data);
  
      const like = await this.prisma.like.create({
        data: {
          like: data?.like,
          sender_id: data?.sender_id,
          recipient_id: data?.recipient_id,
          user_id: data?.user_id,
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
  
    // Mettre à jour un utilisateur
    async updateLike(id: string, data: UpdatelikeDto) {
      const resp_like = await this.prisma.like.update({
        where: { id },
        data: {
          like: data?.like,
          sender_id: data?.sender_id,
          recipient_id: data?.recipient_id,
          user_id: data?.user_id,
        },
      });
      console.log('resp_like', resp_like);
  
      if (!resp_like) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return resp_like;
    }
  
    // Supprimer un utilisateur
    async deletelike(id: string) {
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
  