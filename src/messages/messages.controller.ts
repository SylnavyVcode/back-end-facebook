import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { UpdateMessageDto } from './dto/updateMessageDto';
import { CreateMessageDto } from './dto/CreateMessageDto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('message')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  // Route pour récupérer un utilisateur par son ID
  @Post('message')
  @UseGuards(JwtAuthGuard)
  async postMessage(@Body() messageOptions: CreateMessageDto, @Headers('authorization') authHeader: string) {
 
    console.log('authHeader===>data>>>', authHeader);
    console.log('postMessage===>data>>>', messageOptions);
    // Vérification des données reçues
    return this.messageService.postMessage(messageOptions);
  }
  // Route pour récupérer un utilisateur par son ID
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getMessage(@Param('id') id: string) {
    return this.messageService.getMessage(id);
  }

  // Route pour récupérer tous les utilisateurs
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllMessages() {
    return this.messageService.getAllMessages();
  }

  // Route pour mettre à jour un utilisateur
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateMessage(
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return this.messageService.updateMessage(id, updateMessageDto);
  }

  // Route pour supprimer un utilisateur
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMessage(@Param('id') id: string) {
    return await this.messageService.deleteMessage(id);
  }
}
