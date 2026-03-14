import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { Role, User } from 'src/modules/users/entities/user.domain';
import { UsersService } from 'src/modules/users/users.service';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type Subjects = InferSubjects<typeof User> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(
    @Inject(UsersService) private readonly userService: UsersService,
  ) {}
  async createForUser(accountId: string) {
    const user = await this.userService.findOneByAccountId(accountId);
    if (!user) {
      throw new NotFoundException();
    }
    const { can, build } = new AbilityBuilder(createMongoAbility);

    if ([Role.Admin].includes(user.role)) {
      can(Action.Manage, 'all');
    } else {
      can(Action.Create, User);
      can(Action.Read, User, { account_id: user.account_id });
      can(Action.Update, User, { id: user.id });
      can(Action.Delete, User, { createdBy: user.account_id });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    }) as AppAbility;
  }
}
