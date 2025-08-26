import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePostDto } from './dto/CreatePostDto';
import { UpdatePostDto } from './dto/UpdatePostDto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  // === GESTION DES POSTS ===

  async postPublification(data: CreatePostDto) {
    console.log('>>>>>POST DATA>>>>>>', data);

    const post = await this.prisma.post.create({
      data: {
        content: data?.content ? data?.content : null,
        author_id: data?.author_id,
        group_id: data?.group_id ? data?.group_id : null,
      },
    });

    if (data.image && Array.isArray(data.image) && data.image.length > 0) {
      await this.prisma.image.createMany({
        data: data.image.map((url) => ({
          url,
          postId: post.id,
        })),
      });
    }

    if (data.video && Array.isArray(data.video) && data.video.length > 0) {
      await this.prisma.video.createMany({
        data: data.video.map((url) => ({
          url,
          postId: post.id,
        })),
      });
    }

    const completePost = await this.prisma.post.findUnique({
      where: { id: post.id },
      include: {
        author: true,
        image: true,
        video: true,
        comments: {
          include: {
            author: {
              select: {
                firstname: true,
                lastname: true,
                profilePic: true,
              },
            },
          },
        },
        likes: {
          include: {
            user: {
              select: {
                firstname: true,
                lastname: true,
                profilePic: true,
              },
            },
          },
        },
      },
    });

    return completePost;
  }

  async getPublification(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: id },
      include: {
        author: true,
        image: true,
        video: true,
        comments: {
          include: {
            author: {
              select: {
                firstname: true,
                lastname: true,
                profilePic: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        likes: {
          include: {
            user: {
              select: {
                firstname: true,
                lastname: true,
                profilePic: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async getAllPublifications(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const posts = await this.prisma.post.findMany({
      skip,
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            profilePic: true,
            email: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                firstname: true,
                lastname: true,
                profilePic: true,
              },
            },
          },
          take: 3, // Limiter à 3 commentaires pour la liste
          orderBy: { createdAt: 'desc' },
        },
        likes: {
          include: {
            user: {
              select: {
                firstname: true,
                lastname: true,
                profilePic: true,
              },
            },
          },
        },
        video: true,
        image: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalPosts = await this.prisma.post.count();
    const hasMore = skip + posts.length < totalPosts;

    return {
      data: posts,
      hasMore,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      total: totalPosts,
    };
  }

  // Mise à jour du contenu du post uniquement
  async updatePublification(id: string, data: UpdatePostDto) {
    const existingPost = await this.prisma.post.findUnique({
      where: { id },
      include: {
        image: true,
        video: true,
      },
    });

    if (!existingPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    const updatedPost = await this.prisma.$transaction(async (prisma) => {
      // Mettre à jour le contenu
      const post = await prisma.post.update({
        where: { id },
        data: {
          content: data?.content !== undefined ? data.content : existingPost.content,
        },
      });

      // Gérer les images
      if (data.image !== undefined) {
        await prisma.image.deleteMany({
          where: { postId: id },
        });

        if (Array.isArray(data.image) && data.image.length > 0) {
          await prisma.image.createMany({
            data: data.image.map((url: string) => ({
              url,
              postId: id,
            })),
          });
        }
      }

      // Gérer les vidéos
      if (data.video !== undefined) {
        await prisma.video.deleteMany({
          where: { postId: id },
        });

        if (Array.isArray(data.video) && data.video.length > 0) {
          await prisma.video.createMany({
            data: data.video.map((url: string) => ({
              url,
              postId: id,
            })),
          });
        }
      }

      return await prisma.post.findUnique({
        where: { id },
        include: {
          author: true,
          image: true,
          video: true,
          likes: true,
          comments: true,
        },
      });
    });

    return updatedPost;
  }

  async deletePublification(id: string, user_id?: string) {
    const resp_post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!resp_post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    if (resp_post?.author_id !== user_id) {
      throw new ForbiddenException('Not authorized');
    }

    const deletepost = await this.prisma.post.delete({
      where: { id: resp_post?.id },
    });

    return deletepost;
  }

  // === GESTION DES LIKES ===

  async toggleLike(postId: string, userId: string) {
    // Vérifier si le post existe
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    // Vérifier si l'utilisateur a déjà liké
    const existingLike = await this.prisma.like.findFirst({
      where: {
        post_id: postId,
        user_id: userId,
      },
    });

    if (existingLike) {
      // Supprimer le like (unlike)
      await this.prisma.like.delete({
        where: { id: existingLike.id },
      });
      return { action: 'unliked', message: 'Like supprimé' };
    } else {
      // Ajouter le like
      await this.prisma.like.create({
        data: {
          user_id: userId,
          post_id: postId,
        },
      });
      return { action: 'liked', message: 'Post liké' };
    }
  }

  async getLikes(postId: string) {
    const likes = await this.prisma.like.findMany({
      where: { post_id: postId },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            profilePic: true,
          },
        },
      },
    });

    return {
      count: likes.length,
      likes: likes,
    };
  }

  // === GESTION DES COMMENTAIRES ===

  async addComment(postId: string, userId: string, content: string, image?: string, video?: string) {
    // Vérifier si le post existe
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const comment = await this.prisma.comment.create({
      data: {
        content,
        image: image || '',
        video: video || '',
        post_id: postId,
        author_id: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            profilePic: true,
          },
        },
      },
    });

    return comment;
  }

  async updateComment(commentId: string, userId: string, content: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    if (comment.author_id !== userId) {
      throw new ForbiddenException('Not authorized to update this comment');
    }

    const updatedComment = await this.prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: {
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            profilePic: true,
          },
        },
      },
    });

    return updatedComment;
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    if (comment.author_id !== userId) {
      throw new ForbiddenException('Not authorized to delete this comment');
    }

    await this.prisma.comment.delete({
      where: { id: commentId },
    });

    return { message: 'Comment deleted successfully' };
  }

  async getComments(postId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const comments = await this.prisma.comment.findMany({
      where: { post_id: postId },
      skip,
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            profilePic: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalComments = await this.prisma.comment.count({
      where: { post_id: postId },
    });

    return {
      data: comments,
      hasMore: skip + comments.length < totalComments,
      currentPage: page,
      total: totalComments,
    };
  }
}