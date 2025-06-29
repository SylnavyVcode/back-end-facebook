import { IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto {
 
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  video?: string;
 
}