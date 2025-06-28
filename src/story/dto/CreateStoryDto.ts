import { IsOptional, IsString } from 'class-validator';

export class CreateStoryDto {
 
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
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