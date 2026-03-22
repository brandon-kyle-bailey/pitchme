export enum Role {
  User = 'user',
  Admin = 'admin',
  Owner = 'owner',
}

export interface UserProps {
  id: number;
  account_id: string;
  email: string;
  password: string;
  name?: string;
  refresh_token?: string;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export class User {
  props: UserProps;

  constructor(props: UserProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  get id() {
    return this.props.id;
  }

  get account_id() {
    return this.props.account_id;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get role() {
    return this.props.role;
  }

  get name() {
    return this.props.name;
  }

  get refreshToken() {
    return this.props.refresh_token;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get deletedAt() {
    return this.props.deletedAt;
  }

  get createdBy() {
    return this.props.createdBy;
  }

  get updatedBy() {
    return this.props.updatedBy;
  }

  get deletedBy() {
    return this.props.deletedBy;
  }

  updateName(newName: string) {
    this.props.name = newName;
    this.touch();
  }

  updateEmail(newEmail: string) {
    this.props.email = newEmail;
    this.touch();
  }

  updateRefreshToken(newRefreshToken: string) {
    this.props.refresh_token = newRefreshToken;
    this.touch();
  }

  updateRole(newRole: Role) {
    this.props.role = newRole;
    this.touch();
  }

  updatePassword(newPassword: string) {
    this.props.password = newPassword;
    this.touch();
  }

  softDelete(byUserId?: string) {
    this.props.deletedAt = new Date();
    if (byUserId) {
      this.props.deletedBy = byUserId;
    }
    this.touch();
  }

  updateOwner(id: string) {
    this.props.createdBy = id;
    this.touch();
  }

  updateUpdatedBy(id: string) {
    this.props.updatedBy = id;
    this.touch();
  }

  restore() {
    this.props.deletedAt = undefined;
    this.props.deletedBy = undefined;
    this.touch();
  }

  private touch(id?: string) {
    this.props.updatedAt = new Date();
    if (id) {
      this.props.updatedBy = id;
    }
  }
}
