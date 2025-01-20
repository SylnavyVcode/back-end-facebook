import { IsString } from 'class-validator';

export class resetPasswordDemandDto {
  @IsString({
    message: 'vous devez founir votre email',
  })
  email: string;
}
