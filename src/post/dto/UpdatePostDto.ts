import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  image?: string;

  @IsOptional()
  @IsArray()
  video?: string;
}
