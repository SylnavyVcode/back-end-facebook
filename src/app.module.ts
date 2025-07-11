import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { MailerModule } from './mailer/mailer.module';
import { EmailService } from './email/email.service';
import { EmailController } from './email/email.controller';
import { EmailModule } from './email/email.module';
import { AppGateway } from './app.gateway';
import { MessagesController } from './messages/messages.controller';
import { MessagesService } from './messages/messages.service';
import { MessagesModule } from './messages/messages.module';
import { LikeModule } from './like/like.module';
import { PostModule } from './post/post.module';
import { NotificationModule } from './notification/notification.module';
import { GroupeModule } from './groupe/groupe.module';
import { CommentModule } from './comment/comment.module';
import { ChatModule } from './chat/chat.module';
import { StoryModule } from './story/story.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    MailerModule,
    EmailModule,
    MessagesModule,
    LikeModule,
    PostModule,
    NotificationModule,
    GroupeModule,
    CommentModule,
    ChatModule,
    StoryModule,
    SocketModule,
  ],
  controllers: [
    UserController,
    AuthController,
    EmailController,
    MessagesController,
  ],
  providers: [
    UserService,
    PrismaService,
    AuthService,
    EmailService,
    AppGateway,
    MessagesService,
  ],
})
export class AppModule {}
