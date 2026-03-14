import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { User as UserDomain } from './entities/user.domain';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { UserMapper } from './dto/user.mapper';
import { NIL } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    @Inject(UserMapper)
    private readonly mapper: UserMapper,
  ) {}

  async createWithManager(
    createUserDto: CreateUserDto,
    manager: EntityManager,
  ) {
    const repo = manager.getRepository(User);
    const entity = repo.create(createUserDto);
    const result = await repo.save(entity);
    return this.mapper.toDomain(result);
  }

  async create(createUserDto: CreateUserDto) {
    const entity = this.repo.create(createUserDto);
    const result = await this.repo.save(entity);
    return this.mapper.toDomain(result);
  }

  async findAll(
    skip: number = 0,
    take: number = 100,
    where: FindOptionsWhere<User>,
    sortField: keyof User = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    try {
      const [entities, count] = await this.repo.findAndCount({
        skip,
        take,
        where,
        order: { [sortField]: sortOrder.toUpperCase() as 'ASC' | 'DESC' },
      });
      return {
        data: entities.map((entity) => this.mapper.toDomain(entity)),
        pagination: {
          total: count,
          skip: skip,
          take: take,
          hasNextPage: skip + take < count,
        },
      };
    } catch (err: any) {
      console.log(err);
      return {
        data: [],
        pagination: { total: 0, skip: 0, take, hasNextPage: false },
      };
    }
  }

  async findOne(id: number) {
    try {
      const entity = await this.repo.findOneBy({ id });
      if (entity) {
        return this.mapper.toDomain(entity);
      }
      return null;
    } catch (err: any) {
      throw new InternalServerErrorException(err);
    }
  }

  async findOneByAccountId(account_id: string): Promise<UserDomain> {
    try {
      const model = await this.repo.findOneBy({ account_id });
      if (!model) {
        throw new NotFoundException();
      }
      return this.mapper.toDomain(model);
    } catch (err: any) {
      throw new InternalServerErrorException(err);
    }
  }

  async findOneByEmail(email: string): Promise<UserDomain> {
    try {
      const model = await this.repo.findOneBy({ email });
      if (!model) {
        throw new NotFoundException();
      }
      return this.mapper.toDomain(model);
    } catch (err: any) {
      throw new InternalServerErrorException(err);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDomain> {
    try {
      const entity = await this.findOne(id);
      if (!entity) {
        throw new NotFoundException();
      }
      if (updateUserDto.email) {
        entity.updateEmail(updateUserDto.email);
      }
      if (updateUserDto.refresh_token) {
        entity.updateRefreshToken(updateUserDto.refresh_token);
      }
      if (updateUserDto.role) {
        entity.updateRole(updateUserDto.role);
      }
      if (updateUserDto.name) {
        entity.updateName(updateUserDto.name);
      }
      if (updateUserDto.password) {
        entity.updatePassword(updateUserDto.password);
      }
      if (updateUserDto.createdBy) {
        entity.updateOwner(updateUserDto.createdBy);
      }
      if (updateUserDto.updatedBy) {
        entity.updateUpdatedBy(updateUserDto.updatedBy);
      }
      entity.updateUpdatedBy(NIL);
      await this.repo.update(entity.id, this.mapper.toPersistence(entity));
      return entity;
    } catch (err: any) {
      throw new InternalServerErrorException(err);
    }
  }

  async remove(id: number) {
    try {
      const entity = await this.findOne(id);
      if (!entity) {
        throw new NotFoundException();
      }
      entity.softDelete(NIL);
      await this.repo.update(entity.id, this.mapper.toPersistence(entity));
      return entity;
    } catch (err: any) {
      throw new InternalServerErrorException(err);
    }
  }
}
