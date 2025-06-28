import { IsOptional, IsString } from 'class-validator';

export class CreateGroupeDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}
