import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  likes?: Array<any>;

  @IsOptional()
  @IsArray()
  comments?: Array<any>;

  @IsOptional()
  @IsArray()
  image?: Array<any>;

  @IsOptional()
  @IsArray()
  video?: Array<any>;
}
