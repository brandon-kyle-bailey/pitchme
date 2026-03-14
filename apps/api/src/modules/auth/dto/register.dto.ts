import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class MatchPasswordsConstraint implements ValidatorConstraintInterface {
  validate(confirmPassword: any, args: ValidationArguments) {
    const object = args.object as RegisterDto;
    return object.password === confirmPassword;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    return 'Password and confirmPassword do not match';
  }
}

export function MatchPasswords(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: MatchPasswordsConstraint,
    });
  };
}

export class RegisterDto {
  @ApiProperty({ description: 'The name of the user' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'The email address of the user' })
  @IsEmail()
  username: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  password: string;

  @ApiProperty({ description: 'Confirm password' })
  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  @MatchPasswords({ message: 'Passwords do not match' })
  confirmPassword: string;
}
