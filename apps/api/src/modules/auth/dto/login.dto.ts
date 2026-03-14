import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'The email address of the user' })
  @IsEmail()
  username: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  password: string;
}
