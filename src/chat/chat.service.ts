import { Injectable } from '@nestjs/common';
import { AwsS3Service } from 'src/aws/aws-s3.service';
import { PrismaService } from 'src/prisma.service';
import { SocketService } from 'src/socket/socket.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendChatDto } from './dto/send-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly socketService: SocketService,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async createConversation({
    createConversationDto: { recipientId },
    user_id,
  }: {
    createConversationDto: CreateConversationDto;
    user_id: string;
  }) {
    try {
      const [existingRecipient, existingUser] = await Promise.all([
        this.prisma.user.findUnique({
          where: {
            id: recipientId,
          },
        }),
        this.prisma.user.findUnique({
          where: {
            id: user_id,
          },
        }),
      ]);
      if (!existingRecipient) {
        throw new Error("L'utilisateur sélectionné n'existe pas.");
      }

      if (!existingUser) {
        throw new Error("L'utilisateur n'existe pas.");
      }
      const createdConversation = await this.prisma.conversation.create({
        data: {
          users: {
            connect: [
              {
                id: existingUser.id,
              },
              {
                id: existingRecipient.id,
              },
            ],
          },
        },
      });

      return {
        error: false,
        conversationId: createdConversation.id,
        message: 'La conversation a bien été créée.',
      };
    } catch (error) {
      console.error(error);
      return {
        error: true,
        message: error.message,
      };
    }
  }

  async sendChat({
    sendChatDto,
    conversationId,
    sender_id,
  }: {
    sendChatDto: SendChatDto;
    conversationId: string;
    sender_id: string;
  }) {
    try {
      const [existingConversation, existingUser] = await Promise.all([
        this.prisma.conversation.findUnique({
          where: {
            id: conversationId,
          },
        }),
        this.prisma.user.findUnique({
          where: {
            id: sender_id,
          },
        }),
      ]);
      if (!existingConversation) {
        throw new Error("La conversation n'existe pas.");
      }

      if (!existingUser) {
        throw new Error("L'utilisateur n'existe pas.");
      }
      const updatedConversation = await this.prisma.conversation.update({
        where: {
          id: existingConversation.id,
        },
        data: {
          messages: {
            create: {
              content: sendChatDto.content,
              sender: {
                connect: {
                  id: existingUser.id,
                },
              },
            },
          },
        },
        select: {
          id: true,
          messages: {
            select: {
              content: true,
              id: true,
              sender: {
                select: {
                  id: true,
                  firstname: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });
      // Envoi d'une notification à l'utilisateur ayant reçu le message
      this.socketService.server
        .to(updatedConversation.id)
        .emit('send-chat-update', updatedConversation.messages);
      console.log(updatedConversation);

      return {
        error: false,
        message: 'Votre message a bien été envoyé.',
      };
    } catch (error) {
      console.error(error);
      return {
        error: true,
        message: error.message,
      };
    }
  }

  async getConversations({ user_id }: { user_id: string }) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: user_id,
      },
      select: {
        Conversations: {
          select: {
            id: true,
            updatedAt: true,
            users: {
              select: {
                id: true,
                firstname: true,
                profilePic: true,
              },
            },
            messages: {
              select: {
                content: true,
                id: true,
                sender: {
                  select: {
                    id: true,
                    firstname: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
            },
          },
          orderBy: {
            updatedAt: 'desc',
          },
        },
      },
    });
    if (!existingUser) {
      throw new Error("L'utilisateur n'existe pas.");
    }
    const conversationsWithAvatars = await Promise.all(
      existingUser.Conversations.map(async (conversation) => {
        return {
          ...conversation,
          users: await Promise.all(
            conversation.users.map(async (user) => {
              let avatarUrl = '';
              if (user.profilePic) {
                avatarUrl = await this.awsS3Service.getFileUrl({
                  fileKey: user.profilePic,
                });
              }
              return { ...user, avatarUrl };
            }),
          ),
        };
      }),
    );

    return conversationsWithAvatars;
  }

  async getConversation({
    user_id,
    conversationId,
  }: {
    user_id: string;
    conversationId: string;
  }) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });
    if (!existingUser) {
      throw new Error("L'utilisateur n'existe pas.");
    }

    const conversation = await this.prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      select: {
        id: true,
        updatedAt: true,
        users: {
          select: {
            firstname: true,
            id: true,
            profilePic: true,
            donationsReceived: {
              select: {
                amount: true,
                id: true,
                createdAt: true,
              },
              where: {
                givingUserId: existingUser.id,
              },
            },
            donationsGiven: {
              select: {
                amount: true,
                id: true,
                createdAt: true,
              },
              where: {
                receivingUserId: existingUser.id,
              },
            },
          },
        },
        messages: {
          select: {
            content: true,
            id: true,
            sender: {
              select: {
                id: true,
                firstname: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
    if (!conversation) {
      throw new Error("Cette conversation n'existe pas.");
    }

    const conversationWithAvatars = {
      ...conversation,
      users: await Promise.all(
        conversation.users.map(async (user) => {
          let avatarUrl = '';
          if (user.profilePic) {
            avatarUrl = await this.awsS3Service.getFileUrl({
              fileKey: user.profilePic,
            });
          }
          return { ...user, avatarUrl };
        }),
      ),
    };
    return conversationWithAvatars;
  }
}
