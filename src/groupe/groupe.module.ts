import { Module } from '@nestjs/common';
import { GroupeController } from './groupe.controller';
import { GroupeService } from './groupe.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [GroupeController],
  providers: [GroupeService, PrismaService]
})
export class GroupeModule {}
