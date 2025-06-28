import { IsOptional, IsString } from 'class-validator';

export class CreateLikeDto {
  @IsOptional()
  @IsString()
  user_id: string;

  @IsOptional()
  @IsString()
  post_id?: string;

  @IsOptional()
  @IsString()
  comment_id?: string;
}