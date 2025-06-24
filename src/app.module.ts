import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma.service';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { MailerModule } from './mailer/mailer.module';
import { EmailService } from './email/email.service';
import { EmailController } from './email/email.controller';
import { EmailModule } from './email/email.module';
import { ChatGateway } from './chat.gaway';
import { MessagesController } from './messages/messages.controller';
import { MessagesService } from './messages/messages.service';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [UserModule, MailModule, AuthModule, MailerModule, EmailModule, MessagesModule],
  controllers: [UserController, AuthController, EmailController, MessagesController],
  providers: [UserService, PrismaService, AuthService, EmailService, ChatGateway, MessagesService],
})
export class AppModule {}
