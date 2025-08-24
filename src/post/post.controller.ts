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
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreatePostDto } from './dto/CreatePostDto';
import { UpdatePostDto } from './dto/UpdatePostDto';
import { PostService } from './post.service';
import { JwtStrategy, UserPayload } from 'src/auth/jwt.strategy';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    jwtStrategie: JwtStrategy,
  ) {}

  // Route pour récupérer un Publification par son ID
  @Post('message')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          console.log('file', file);
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
    console.log('files', files);
    console.log('messageOptions', messageOptions);

    const user = req.user;

    // Créer les URLs complètes pour les images
    const imageUrls =
      files && files.length > 0
        ? files.map((file) => `http://localhost:3000/uploads/${file.filename}`)
        : [];

    console.log('imageUrls générées:', imageUrls);

    const messageWithUser = {
      ...messageOptions,
      author_id: user.user_id,
      image: imageUrls, // Passer le tableau d'URLs
    };

    console.log('Données finales à sauvegarder:', messageWithUser);

    return this.postService.postPublification(messageWithUser);
  }
  // Route pour récupérer un Publification par son ID
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getPublification(
    @Param('id') id: string,

    @Req() req: Request & { user: UserPayload },
  ) {
    const user = req.user;
    console.log('user extrait du token ===>', user); // { user_id: '...' }
    return this.postService.getPublification(id);
  }

  // Route pour récupérer tous les Publifications
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllPublifications(
    @Req() req: Request & { user: UserPayload },
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const user = req.user;
    const currentPage = parseInt(page, 10);
    const itemsPerPage = parseInt(limit, 10);

    console.log('user extrait du token ===>', user); // { user_id: '...' }

    return this.postService.getAllPublifications(currentPage, itemsPerPage);
  }

  // Route pour mettre à jour un Publification
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updatePublification(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,

    @Req() req: Request & { user: UserPayload },
  ) {
    const user = req.user;
    console.log('user extrait du token ===>', user); // { user_id: '...' }
    return this.postService.updatePublification(id, updatePostDto);
  }

  // Route pour supprimer un Publification
  @Delete('user_id/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePublification(
    @Param('id') id: string,
    @Headers('user_id') user_id?: string,
  ) {
    return await this.postService.deletePublification(id, user_id);
  }
}
