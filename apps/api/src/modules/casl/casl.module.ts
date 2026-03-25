import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CaslAbilityFactory } from './factories/casl-ability.factory';
import { PoliciesGuard } from './guards/policies.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UserMapper } from '../users/dto/user.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserMapper, UsersService, CaslAbilityFactory, PoliciesGuard],
  exports: [CaslAbilityFactory, PoliciesGuard],
})
export class CaslModule {}
