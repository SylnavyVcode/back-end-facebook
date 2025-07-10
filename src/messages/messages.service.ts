import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateMessageDto } from './dto/CreateMessageDto';
import { UpdateMessageDto } from './dto/updateMessageDto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ Création d'un message
  async postMessage(data: CreateMessageDto) {
    const message = await this.prisma.message.create({
      data: {
        content: data.content,
        sender_id: data.sender_id,
        chat_id: data.chat_id,
      },
    });

    return message;
  }

  // ✅ Récupérer un message par son ID
  async getMessage(id: string) {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: {
        sender: true,
        conversation: true,
      },
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return message;
  }

  // ✅ Récupérer tous les messages
  async getAllMessages() {
    const messages = await this.prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        sender: true,
        conversation: true,
      },
    });

    return messages;
  }

  // ✅ Mise à jour d’un message
  async updateMessage(id: string, data: UpdateMessageDto) {
    const message = await this.prisma.message.update({
      where: { id },
      data: {
        content: data.content,
        sender_id: data.sender_id,
        chat_id: data.chat_id,
      },
    });

    return message;
  }

  // ✅ Suppression d’un message
  async deleteMessage(id: string) {
    // Vérification existence
    const message = await this.prisma.message.findUnique({ where: { id } });
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return await this.prisma.message.delete({ where: { id } });
  }
}
