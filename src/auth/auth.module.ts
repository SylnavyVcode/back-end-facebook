import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from 'src/user/user.service';
import { MailerModule } from 'src/mailer/mailer.module';
import { EmailService } from 'src/email/email.service';
import { EmailModule } from 'src/email/email.module';



@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '20d' },
    }),MailerModule, EmailModule
  ],
  providers: [AuthService, PrismaService, JwtService, JwtStrategy, UserService, AuthService, EmailService],
  controllers: [AuthController],
})
export class AuthModule {}
