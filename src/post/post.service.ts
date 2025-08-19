import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePostDto } from './dto/CreatePostDto';
import { UpdatePostDto } from './dto/UpdatePostDto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  // creation d'un post
  async postPublification(data: CreatePostDto) {
    console.log('>>>>>POST DATA>>>>>>', data);

    const post = await this.prisma.post.create({
      data: {
        content: data?.content ? data?.content : null,
        image: data?.image ? JSON.stringify(data?.image) : null,
        video: data?.video ? JSON.stringify(data?.video) : null,
        author_id: data?.author_id,
        group_id: data?.group_id ? data?.group_id : null,
      },
    });

    if (!post) {
      throw new NotFoundException(`post with ID ${post} not found`);
    }

    return post;
  }

  // Récupérer un Post par son ID
  async getPublification(id: string) {
    console.log('>>>>>>>>>>>', id);

    const post = await this.prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!post) {
      throw new NotFoundException(`post with ID ${id} not found`);
    }

    return post;
  }
  async getAllPublifications(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const posts = await this.prisma.post.findMany({
      skip,
      take: limit,
      include: {
        author: true,
        comments: true,
        likes: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Vérifie s’il reste des données après la page actuelle
    const totalPosts = await this.prisma.post.count();
    const hasMore = skip + posts.length < totalPosts;

    return {
      data: posts,
      hasMore,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
    };
  }

  // Mettre à jour un Post
  async updatePublification(id: string, data: UpdatePostDto) {
    const resp_post = await this.prisma.post.update({
      where: { id },
      data: {
        content: data?.content,
        image: JSON.stringify(data?.image),
        video: JSON.stringify(data?.video),
      },
    });
    console.log('resp_post', resp_post);

    if (!resp_post) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return resp_post;
  }

  // Supprimer un Post
  async deletePublification(id: string, user_id?: string) {
    const resp_post = await this.prisma.post.findUnique({
      where: { id },
    });
    if (resp_post?.author_id !== user_id) throw new Error('Not authorized');

    const deletepost = await this.prisma.post.delete({
      where: { id: resp_post?.id },
    });

    if (!deletepost) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return deletepost;
  }
}
