import { IsOptional, IsString } from 'class-validator';

export class UpdateStoryDto {
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  video?: string;
}
