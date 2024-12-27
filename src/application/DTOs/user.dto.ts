import { IsEmail, IsString, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsInt()
  role: number;

  @IsString()
  firebaseId: string;
}
