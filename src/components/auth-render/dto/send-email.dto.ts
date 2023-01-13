import { IsEmail, IsNotEmpty } from 'class-validator';

export default class SendEmailDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email;
}
