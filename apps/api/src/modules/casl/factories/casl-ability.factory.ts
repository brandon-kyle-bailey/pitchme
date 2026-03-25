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
  constructor(@Inject(UsersService) private readonly service: UsersService) {}
  async createForUser(id: string) {
    const user = await this.service.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    const { can, build } = new AbilityBuilder(createMongoAbility);

    if ([Role.Admin].includes(user.role)) {
      can(Action.Manage, 'all');
    } else {
      can(Action.Create, User); // TODO... Any user can create a user? :thinking...
      can(Action.Update, User, { id: user.id });
      can(Action.Delete, User, { createdBy: user.id });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    }) as AppAbility;
  }
}
