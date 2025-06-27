import { IsOptional, IsString } from 'class-validator';

export class UpdateMessageDto {
  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  sender_id?: string;

  @IsOptional()
  @IsString()
  recipient_id?: string;

  @IsOptional()
  @IsString()
  user_id?: string;
}
