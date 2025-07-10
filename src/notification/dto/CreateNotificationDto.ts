import { IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsOptional()
  @IsString()
  user_id?: string;

  @IsOptional()
  @IsString()
  post_id?: string;

  @IsOptional()
  @IsString()
  comment_id?: string;

  @IsOptional()
  read?: boolean;


  @IsOptional()
  content?: string;
}