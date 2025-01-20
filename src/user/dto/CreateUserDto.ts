import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({
    message: 'vous devez founir votre prénom',
  })
  firstname: string;

  @IsString({
    message: 'vous devez founir votre nom de famille',
  })
  lastname: string;

  @IsString({
    message: 'vous devez founir une adresse email valide',
  })
  email: string;

  @IsString()
  telephone?: string;

  @IsString({
    message: 'vous devez founir votre genre',
  })
  genre: string;

  @IsString()
  anniversaire: string;

  @IsOptional()
  @IsString()
  profilePic?: string;

  @IsOptional()
  @IsString()
  profilCoverPic?: string;

  @IsString({
    message: 'Votre mot de passe doit faire au moins 8 caractères.',
  })
  password: string;
}
