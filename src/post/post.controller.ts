import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  Headers,
  Req,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreatePostDto } from './dto/CreatePostDto';
import { UpdatePostDto } from './dto/UpdatePostDto';
import { PostService } from './post.service';
import { JwtStrategy, UserPayload } from 'src/auth/jwt.strategy';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    jwtStrategie: JwtStrategy,
  ) {}

  // === ROUTES POUR LES POSTS ===

  @Post('message')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9) +
            extname(file.originalname);
          callback(null, uniqueName);
        },
      }),
    }),
  )
  async postPublification(
    @Body() messageOptions: any,
    @Req() req: Request & { user: UserPayload },
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const user = req.user;
    const imageUrls =
      files && files.length > 0
        ? files.map((file) => `http://localhost:3000/uploads/${file.filename}`)
        : [];

    const messageWithUser = {
      ...messageOptions,
      author_id: user.user_id,
      image: imageUrls,
    };

    return this.postService.postPublification(messageWithUser);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getPublification(@Param('id') id: string) {
    return this.postService.getPublification(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllPublifications(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const currentPage = parseInt(page, 10);
    const itemsPerPage = parseInt(limit, 10);
    return this.postService.getAllPublifications(currentPage, itemsPerPage);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9) +
            extname(file.originalname);
          callback(null, uniqueName);
        },
      }),
    }),
  )
  async updatePublification(
    @Param('id') id: string,
    @Body() updatePostDto: any,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    let imageUrls: string[] = [];
    if (files && files.length > 0) {
      imageUrls = files.map(
        (file) => `http://localhost:3000/uploads/${file.filename}`,
      );
    }

    const updateData: UpdatePostDto = {
      content: updatePostDto.content,
      image: imageUrls.length > 0 ? imageUrls : updatePostDto.images,
      video: updatePostDto.videos,
    };

    return this.postService.updatePublification(id, updateData);
  }

  @Delete('user_id/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePublification(
    @Param('id') id: string,
    @Headers('user_id') user_id?: string,
  ) {
    return await this.postService.deletePublification(id, user_id);
  }

  // === ROUTES POUR LES LIKES ===

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async toggleLike(
    @Param('id') postId: string,
    @Req() req: Request & { user: UserPayload },
  ) {
    const user = req.user;
    return this.postService.toggleLike(postId, user.user_id);
  }

  @Get(':id/likes')
  @UseGuards(JwtAuthGuard)
  async getLikes(@Param('id') postId: string) {
    return this.postService.getLikes(postId);
  }

  // === ROUTES POUR LES COMMENTAIRES ===

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async addComment(
    @Param('id') postId: string,
    @Body() commentData: { content: string; image?: string; video?: string },
    @Req() req: Request & { user: UserPayload },
  ) {
    const user = req.user;
    return this.postService.addComment(
      postId,
      user.user_id,
      commentData.content,
      commentData.image,
      commentData.video,
    );
  }

  @Get(':id/comments')
  @UseGuards(JwtAuthGuard)
  async getComments(
    @Param('id') postId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const currentPage = parseInt(page, 10);
    const itemsPerPage = parseInt(limit, 10);
    return this.postService.getComments(postId, currentPage, itemsPerPage);
  }

  @Put('comments/:commentId')
  @UseGuards(JwtAuthGuard)
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() updateData: { content: string },
    @Req() req: Request & { user: UserPayload },
  ) {
    const user = req.user;
    return this.postService.updateComment(
      commentId,
      user.user_id,
      updateData.content,
    );
  }

  @Delete('comments/:commentId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(
    @Param('commentId') commentId: string,
    @Req() req: Request & { user: UserPayload },
  ) {
    const user = req.user;
    return this.postService.deleteComment(commentId, user.user_id);
  }
}
