import { Module } from '@nestjs/common';
// import { AwsS3Service } from 'src/aws/aws-s3.service';
import { PrismaService } from 'src/prisma.service';
import { SocketService } from '../socket/socket.service';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
@Module({
  providers: [ChatService, PrismaService, SocketService],
  controllers: [ChatController],
})
export class ChatModule {}
