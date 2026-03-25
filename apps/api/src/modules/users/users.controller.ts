import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ControllerCacheInterceptor } from 'src/interceptors/controller-cache.interceptor';
import { CaslAbilityFactory } from '../casl/factories/casl-ability.factory';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMapper } from './dto/user.mapper';
import { UsersService } from './users.service';

@Controller({ path: 'users', version: '1' })
// @UseGuards(PoliciesGuard)
@UseInterceptors(ControllerCacheInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
export class UsersController {
  constructor(
    @Inject(UsersService)
    private readonly service: UsersService,
    @Inject(UserMapper) private readonly mapper: UserMapper,
    @Inject(CaslAbilityFactory)
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  // @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, User))
  async create(
    @Body() createUserDto: CreateUserDto,
    // @Request() req: { user: User },
  ) {
    // const ability = await this.caslAbilityFactory.createForUser(req.user.id);
    // if (!ability.can(Action.Create, User)) {
    //   throw new UnauthorizedException();
    // }
    const result = await this.service.create(createUserDto);
    if (!result) {
      throw new BadRequestException();
    }
    return this.mapper.toInterface(result);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.service.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
