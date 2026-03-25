import { Exclude } from 'class-transformer';

export enum Role {
  User = 'user',
  Admin = 'admin',
  Owner = 'owner',
}

export class User {
  id: string;
  email: string;
  password: string;
  role: Role;
  name?: string;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(props: Partial<User>) {
    const createdAt = props.createdAt ?? new Date();
    const updatedAt = props.updatedAt ?? new Date();
    Object.assign(this, { ...props, createdAt, updatedAt });
  }

  updateName(newName: string) {
    this.name = newName;
    this.touch();
  }

  updateEmail(newEmail: string) {
    this.email = newEmail;
    this.touch();
  }

  updateRefreshToken(newRefreshToken: string) {
    this.refreshToken = newRefreshToken;
    this.touch();
  }

  updateRole(newRole: Role) {
    this.role = newRole;
    this.touch();
  }

  updatePassword(newPassword: string) {
    this.password = newPassword;
    this.touch();
  }

  softDelete(byUserId?: string) {
    this.deletedAt = new Date();
    if (byUserId) {
      this.deletedBy = byUserId;
    }
    this.touch();
  }

  updateOwner(id: string) {
    this.createdBy = id;
    this.touch();
  }

  updateUpdatedBy(id: string) {
    this.updatedBy = id;
    this.touch();
  }

  restore() {
    this.deletedAt = undefined;
    this.deletedBy = undefined;
    this.touch();
  }

  private touch(id?: string) {
    this.updatedAt = new Date();
    if (id) {
      this.updatedBy = id;
    }
  }
}
