import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory/casl-ability.factory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UserMapper } from '../users/dto/user.mapper';
import { PoliciesGuard } from 'src/guards/policies.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [CaslAbilityFactory, PoliciesGuard, UsersService, UserMapper],
  exports: [CaslAbilityFactory, PoliciesGuard],
})
export class CaslModule {}
