import { IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  video?: string;
}
