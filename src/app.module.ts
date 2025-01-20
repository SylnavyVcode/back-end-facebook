import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma.service';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [UserModule, MailModule, AuthModule],
  controllers: [UserController, AuthController],
  providers: [UserService, PrismaService, AuthService],
})
export class AppModule {}
