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
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreatePostDto } from './dto/CreatePostDto';
import { UpdatePostDto } from './dto/UpdatePostDto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // Route pour récupérer un Publification par son ID
  @Post('message')
  @UseGuards(JwtAuthGuard)
  async postPublification(
    @Body() messageOptions: CreatePostDto,
    @Headers('authorization') authHeader: string,
  ) {
    console.log('authHeader===>data>>>', authHeader);
    console.log('postPublification===>data>>>', messageOptions);
    // Vérification des données reçues
    return this.postService.postPublification(messageOptions);
  }
  // Route pour récupérer un Publification par son ID
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getPublification(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ) {
    console.log('authHeader===>data>>>', authHeader);
    return this.postService.getPublification(id);
  }

  // Route pour récupérer tous les Publifications
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllPublifications(@Headers('authorization') authHeader: string) {
    console.log('authHeader===>data>>>', authHeader);
    return this.postService.getAllPublifications();
  }

  // Route pour mettre à jour un Publification
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updatePublification(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Headers('authorization') authHeader: string,
  ) {
    console.log('authHeader===>data>>>', authHeader);
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
