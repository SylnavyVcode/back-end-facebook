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

@Module({
  imports: [UserModule, MailModule, AuthModule, MailerModule, EmailModule],
  controllers: [UserController, AuthController, EmailController],
  providers: [UserService, PrismaService, AuthService, EmailService, ChatGateway],
})
export class AppModule {}
