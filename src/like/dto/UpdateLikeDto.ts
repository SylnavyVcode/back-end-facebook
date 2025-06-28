import { IsOptional, IsString } from 'class-validator';

export class UpdateLikeDto {
  @IsOptional()
  @IsString()
  post_id?: string;

  @IsOptional()
  @IsString()
  comment_id?: string;
}