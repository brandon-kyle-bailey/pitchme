import { Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import { User as UserDomain } from '../entities/user.domain';
import { User as UserEntity } from '../entities/user.entity';

@Injectable()
export class UserMapper {
  static toInterface(user: UserDomain): UserDto {
    return new UserDto(user.props);
  }
  toInterface(user: UserDomain): UserDto {
    return UserMapper.toInterface(user);
  }
  static toDomain(user: UserEntity): UserDomain {
    return new UserDomain({
      ...user,
    });
  }
  toDomain(user: UserEntity): UserDomain {
    return UserMapper.toDomain(user);
  }

  static toPersistence(user: UserDomain) {
    return {
      ...user.props,
    };
  }
  toPersistence(user: UserDomain) {
    return UserMapper.toPersistence(user);
  }
}
