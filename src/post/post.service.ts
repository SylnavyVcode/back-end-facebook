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

    // Créer le post principal
    const post = await this.prisma.post.create({
      data: {
        content: data?.content ? data?.content : null,
        author_id: data?.author_id,
        group_id: data?.group_id ? data?.group_id : null,
      },
    });

    // Créer les images si présentes
    if (data.image && Array.isArray(data.image) && data.image.length > 0) {
      await this.prisma.image.createMany({
        data: data.image.map((url) => ({
          url,
          postId: post.id,
        })),
      });
    }

    // Créer les vidéos si présentes
    if (data.video && Array.isArray(data.video) && data.video.length > 0) {
      await this.prisma.video.createMany({
        data: data.video.map((url) => ({
          url,
          postId: post.id,
        })),
      });
    }

    // Retourner le post complet avec ses relations
   
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

  // Récupérer un Post par son ID avec images
  async getPublification(id: string) {
    console.log('Récupération du post ID:', id);

    const post = await this.prisma.post.findUnique({
      where: { id: id },
      include: {
        author: true,
        image: true, // ✅ Inclure les images
        video: true, // ✅ Inclure les vidéos
        comments: true,
        likes: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    console.log('Post trouvé avec images:', post);
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
        },
        likes: true,
        video: true, // ✅ Inclure les vidéos
        image: true, // ✅ Inclure les images
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log('Posts récupérés:', posts.length);
    console.log('Premier post avec images:', posts[0]?.image);

    // Vérifier s'il reste des données
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

// Mettre à jour un Post - VERSION CORRIGÉE
  async updatePublification(id: string, data: UpdatePostDto) {
    console.log('Update data:', data);
    
    // Vérifier que le post existe
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

    // Transaction pour mettre à jour le post et ses relations
    const updatedPost = await this.prisma.$transaction(async (prisma) => {
      // 1. Mettre à jour le contenu du post
      const post = await prisma.post.update({
        where: { id },
        data: {
          content: data?.content !== undefined ? data.content : existingPost.content,
          // On ne peut pas mettre à jour directement likes et comments ici
          // car ce sont des relations
        },
      });

      // 2. Gérer les images si nécessaire
      if (data.image !== undefined) {
        // Supprimer les anciennes images
        await prisma.image.deleteMany({
          where: { postId: id },
        });

        // Ajouter les nouvelles images
        if (Array.isArray(data.image) && data.image.length > 0) {
          await prisma.image.createMany({
            data: data.image.map((url: string) => ({
              url,
              postId: id,
            })),
          });
        }
      }

      // 3. Gérer les vidéos si nécessaire
      if (data.video !== undefined) {
        // Supprimer les anciennes vidéos
        await prisma.video.deleteMany({
          where: { postId: id },
        });

        // Ajouter les nouvelles vidéos
        if (Array.isArray(data.video) && data.video.length > 0) {
          await prisma.video.createMany({
            data: data.video.map((url: string) => ({
              url,
              postId: id,
            })),
          });
        }
      }

      // 4. Retourner le post complet mis à jour
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

  // Supprimer un Post
  async deletePublification(id: string, user_id?: string) {
    const resp_post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!resp_post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    if (resp_post?.author_id !== user_id) {
      throw new Error('Not authorized');
    }

    // Plus besoin de supprimer manuellement les images et vidéos
    // grâce à onDelete: Cascade
    const deletepost = await this.prisma.post.delete({
      where: { id: resp_post?.id },
    });

    return deletepost;
  }
}
