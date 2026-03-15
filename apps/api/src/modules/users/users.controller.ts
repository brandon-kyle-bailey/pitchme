import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CheckPolicies, PoliciesGuard } from 'src/guards/policies.guard';
import { ControllerCacheInterceptor } from 'src/interceptors/controller-cache.interceptor';
import { NIL } from 'uuid';
import {
  Action,
  AppAbility,
  CaslAbilityFactory,
} from '../casl/casl-ability.factory/casl-ability.factory';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMapper } from './dto/user.mapper';
import { User } from './entities/user.domain';
import { User as UserModel } from './entities/user.entity';
import { UsersService } from './users.service';
import { FindAllResponseDto } from 'src/libs/dtos/src/find-all-response.dto';

const ALLOWED_SORT_FIELDS = ['createdAt', 'updatedAt', 'email', 'name'];

@Controller({ path: 'users', version: '1' })
@UseInterceptors(ControllerCacheInterceptor, ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, PoliciesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(
    @Inject(UsersService)
    private readonly service: UsersService,
    @Inject(UserMapper)
    private readonly mapper: UserMapper,
    @Inject(CaslAbilityFactory)
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, User))
  async create(@Body() createUserDto: CreateUserDto) {
    const password = await bcrypt.hash(createUserDto.password, 10);
    return this.mapper.toInterface(
      await this.service.create({ ...createUserDto, password, createdBy: NIL }),
    );
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({
    name: 'sortField',
    required: false,
    type: String,
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    example: 'asc',
  })
  @ApiOkResponse({ type: FindAllResponseDto })
  async findAll(
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 100,
    @Query('sortField') sortField: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
    @Request() req: { user: User },
  ): Promise<FindAllResponseDto<{ [key: string]: any }>> {
    if (sortField && !ALLOWED_SORT_FIELDS.includes(sortField)) {
      throw new BadRequestException(
        `Invalid sortField. Allowed: ${ALLOWED_SORT_FIELDS.join(', ')}`,
      );
    }
    if (!['asc', 'desc'].includes(sortOrder)) {
      sortOrder = 'desc';
    }
    const ability = await this.caslAbilityFactory.createForUser(
      req.user.account_id,
    );
    const result = await this.service.findAll(
      skip,
      take,
      {
        account_id: req.user.account_id,
      },
      sortField ? (sortField as keyof UserModel) : undefined,
      sortOrder,
    );
    return {
      ...result,
      data: result.data
        .filter((entity) => ability.can(Action.Read, entity))
        .map((entity) => this.mapper.toInterface(entity)),
    };
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  async findOne(@Param('id') id: string, @Request() req: { user: User }) {
    const ability = await this.caslAbilityFactory.createForUser(
      req.user.account_id,
    );
    const user = await this.service.findOneByAccountId(id);
    if (!user) {
      throw new NotFoundException();
    }
    if (!ability.can(Action.Read, user)) {
      throw new UnauthorizedException();
    }
    return this.mapper.toInterface(user);
  }

  @Patch(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, User))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: { user: User },
  ) {
    const ability = await this.caslAbilityFactory.createForUser(
      req.user.account_id,
    );
    const user = await this.service.findOneByAccountId(id);
    if (!user) {
      throw new NotFoundException();
    }
    if (!ability.can(Action.Update, user)) {
      throw new UnauthorizedException();
    }
    const updated = await this.service.update(user.id, updateUserDto);
    return this.mapper.toInterface(updated);
  }

  @Delete(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, User))
  async remove(@Param('id') id: string, @Request() req: { user: User }) {
    const ability = await this.caslAbilityFactory.createForUser(
      req.user.account_id,
    );
    const user = await this.service.findOneByAccountId(id);
    if (!user) {
      throw new NotFoundException();
    }
    if (!ability.can(Action.Delete, user)) {
      throw new UnauthorizedException();
    }
    await this.service.remove(user.id);
    return user.id;
  }
}
