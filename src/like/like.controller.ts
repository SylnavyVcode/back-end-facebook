import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards, Headers } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateMessageDto } from 'src/messages/dto/CreateMessageDto';
import { UpdateMessageDto } from 'src/messages/dto/updateMessageDto';
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
 constructor(private readonly likeService: LikeService) {}

  // Route pour récupérer un utilisateur par son ID
  @Post('message')
  @UseGuards(JwtAuthGuard)
  async postLike(@Body() messageOptions: CreateMessageDto, @Headers('authorization') authHeader: string) {
    // Vérification des données reçues
    return this.likeService.postLike(messageOptions);
  }
  // Route pour récupérer un utilisateur par son ID
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getLike(@Param('id') id: string) {
    return this.likeService.getLike(id);
  }

  // Route pour récupérer tous les utilisateurs
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllLike() {
    return this.likeService.getAllLike();
  }

  // Route pour supprimer un utilisateur
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async dislike(@Param('id') id: string) {
    return await this.likeService.dislike(id);
  }
}

