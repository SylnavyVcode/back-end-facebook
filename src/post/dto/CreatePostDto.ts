import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  image?: Array<string> | null;

  @IsOptional()
   @IsArray()
  video?: Array<string> | null;

  @IsString()
  author_id: string;

  @IsOptional()
  @IsString()
  group_id?: string;

  @IsOptional()
  @IsString()
  page_id?: string;
}
