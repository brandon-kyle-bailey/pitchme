import { Injectable } from '@nestjs/common';
import { User as UserDomain } from '../entities/user.domain';
import { User as UserModel } from '../entities/user.entity';
import { UserDto } from './user.dto';

@Injectable()
export class UserMapper {
  static toInterface(user: UserDomain): UserDto {
    return new UserDto(user);
  }
  toInterface(user: UserDomain): UserDto {
    return UserMapper.toInterface(user);
  }
  static toDomain(user: UserModel): UserDomain {
    return new UserDomain({
      ...user,
    });
  }
  toDomain(user: UserModel): UserDomain {
    return UserMapper.toDomain(user);
  }

  static toPersistence(user: UserDomain) {
    return {
      ...user,
    };
  }
  toPersistence(user: UserDomain) {
    return UserMapper.toPersistence(user);
  }
}
