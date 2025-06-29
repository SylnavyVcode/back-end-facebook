import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/CreateCommentDto';
import { UpdateCommentDto } from './dto/UpdateCommentDto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // Route pour récupérer un Comment par son ID
  @Post('comment')
  @UseGuards(JwtAuthGuard)
  async CommentComment(
    @Body() messageOptions: CreateCommentDto,
    @Headers('authorization') authHeader: string,
  ) {
    console.log('authHeader===>data>>>', authHeader);
    console.log('CommentComment===>data>>>', messageOptions);
    // Vérification des données reçues
    return this.commentService.postCommentaire(messageOptions);
  }
  // Route pour récupérer un Comment par son ID
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getComment(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ) {
    console.log('authHeader===>data>>>', authHeader);
    return this.commentService.getCommentaire(id);
  }

  // Route pour récupérer tous les Comments
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllComments(@Headers('authorization') authHeader: string) {
    console.log('authHeader===>data>>>', authHeader);
    return this.commentService.getAllCommentaires();
  }

  // Route pour mettre à jour un Comment
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Headers('authorization') authHeader: string,
  ) {
    console.log('authHeader===>data>>>', authHeader);
    return this.commentService.updateCommentaire(id, updateCommentDto);
  }

  // Route pour supprimer un Comment
  @Delete('user_id/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(
    @Param('id') id: string,
    @Headers('user_id') user_id?: string,
  ) {
    return await this.commentService.deleteCommentaire(id);
  }
}
