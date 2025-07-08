import { Injectable, NotFoundException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { CreateMessageDto } from './dto/CreateMessageDto';
import { UpdateMessageDto } from './dto/updateMessageDto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  // creation d'un message
  async postMessage(data: CreateMessageDto) {
    console.log('>>>>>>>>>>>', data);

    const message = await this.prisma.message.create({
      data: {
        content: data.content,
        sender_id: data.sender_id,
        recipient_id: data.recipient_id,
        user_id: data.user_id,
      },
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${message} not found`);
    }

    return message;
  }

  // Récupérer un utilisateur par son ID
  async getMessage(id: string) {
    console.log('>>>>>>>>>>>', id);

    const message = await this.prisma.message.findUnique({
      where: {
        id: id,
      },
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return message;
  }

  // Récupérer tous les utilisateurs (optionnel : pagination)
  async getAllMessages() {
    const message = await this.prisma.message.findMany({});
    console.log('>>>>>>all message)===', message);

    return message;
  }

  // Mettre à jour un utilisateur
  async updateMessage(id: string, data: UpdateMessageDto) {
    const resp_message = await this.prisma.message.update({
      where: { id },
      data: {
        message: data?.message,
        sender_id: data?.sender_id,
        recipient_id: data?.recipient_id,
        user_id: data?.user_id,
      },
    });
    console.log('resp_message', resp_message);

    if (!resp_message) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return resp_message;
  }

  // Supprimer un utilisateur
  async deleteMessage(id: string) {
    const resp_message = await this.prisma.message.findUnique({
      where: { id },
    });

    const deleteMessage = await this.prisma.message.delete({
      where: { id: resp_message?.user_id },
    });

    if (!deleteMessage) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return deleteMessage;
  }
}
