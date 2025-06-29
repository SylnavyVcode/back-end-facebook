import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCommentDto } from './dto/CreateCommentDto';
import { UpdateCommentDto } from './dto/UpdateCommentDto';

@Injectable()
export class CommentService {
    constructor(private readonly prisma: PrismaService) {}
  
    // creation d'un comment
    async postCommentaire(data: CreateCommentDto) {
      console.log('>>>>>>>>>>>', data);
  
      const comment = await this.prisma.comment.create({
        data: {
          content: data?.content ?? '',
          image: data?.image ?? '',
          video: data?.video ?? '',
          author_id: data?.author_id,
          post_id: data?.post_id,      
        },
      });
  
      if (!comment) {
        throw new NotFoundException(`comment with ID ${comment} not found`);
      }
  
      return comment;
    }
  
    // Récupérer un comment par son ID
    async getCommentaire(id: string) {
      console.log('>>>>>>>>>>>', id);
  
      const comment = await this.prisma.comment.findUnique({
        where: {
          id: id,
        },
      });
  
      if (!comment) {
        throw new NotFoundException(`comment with ID ${id} not found`);
      }
  
      return comment;
    }
  
    // Récupérer tous les comment (optionnel : pagination)
    async getAllCommentaires() {
      const comment = await this.prisma.comment.findMany({});
      console.log('>>>>>>all comment)===', comment);
  
      return comment;
    }
  
    // Mettre à jour un comment
    async updateCommentaire(id: string, data: UpdateCommentDto) {
      const resp_comment = await this.prisma.comment.update({
        where: { id },
        data: {
          content: data?.content,
          image: data?.image,
          video: data?.video,   
        },
      });
      console.log('resp_comment', resp_comment);
  
      if (!resp_comment) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return resp_comment;
    }
  
    // Supprimer un comment
    async deleteCommentaire(id: string) {
      const resp_comment = await this.prisma.comment.findUnique({
        where: { id },
      });
  
      const deletecomment = await this.prisma.comment.delete({
        where: { id: resp_comment?.id },
      });
  
      if (!deletecomment) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return deletecomment;
    }
  }
  
