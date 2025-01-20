import { IsString } from 'class-validator';

export class signInDto {
  @IsString({
    message: 'vous devez founir votre email',
  })
  email: string;

  @IsString({
    message: 'vous devez founir votre mot de passe',
  })
  password: string;
}
