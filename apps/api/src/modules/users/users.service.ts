import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMapper } from './dto/user.mapper';
import { User } from './entities/user.domain';
import { User as model } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<model>,
    @Inject(UserMapper) private readonly mapper: UserMapper,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = new User(createUserDto);
    const result = await this.repo.save(user);
    if (!result) {
      return null;
    }
    return this.mapper.toDomain(result);
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      return null;
    }
    return this.mapper.toDomain(user);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
