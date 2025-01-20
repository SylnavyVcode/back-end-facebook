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
} from '@nestjs/common';
import { UserService } from './user.service';
// import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';

@Controller('users') // Préfixe pour les routes d'utilisateur
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Route pour récupérer un utilisateur par son ID
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  // Route pour récupérer tous les utilisateurs
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  // Route pour mettre à jour un utilisateur
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  // Route pour supprimer un utilisateur
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);
  }
}
