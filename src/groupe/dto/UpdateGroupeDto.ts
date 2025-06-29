import { IsOptional, IsString } from 'class-validator';

export class UpdateGroupeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
