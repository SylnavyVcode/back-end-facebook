import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  image?: string;

  @IsOptional()
   @IsArray()
  video?: string;

  @IsString()
  author_id: string;

  @IsOptional()
  @IsString()
  group_id?: string;

  @IsOptional()
  @IsString()
  page_id?: string;
}
