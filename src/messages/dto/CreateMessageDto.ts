import { IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsString()
  sender_id: string;

  @IsString()
  chat_id: string;
}
