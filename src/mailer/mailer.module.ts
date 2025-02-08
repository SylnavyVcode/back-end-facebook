import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';

@Module({
  providers: [MailerService],
  exports: [MailerService],  // 👈 Exportation pour qu'il soit utilisable ailleurs
})
export class MailerModule {}