import { IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
 
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  video?: string;

  @IsString()
  post_id: string;

  @IsString()
  author_id: string;

}