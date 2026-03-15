import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { NIL } from 'uuid';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Role } from '../users/entities/user.domain';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller({ path: 'auth', version: '1' })
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(UsersService) private readonly UsersService: UsersService,
    @Inject(DataSource) private readonly dataSource: DataSource,
  ) {}

  @Post('login')
  @Throttle({
    short: { limit: 5, ttl: 1000 },
    medium: { limit: 20, ttl: 60000 },
  })
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return await this.authService.login(user);
  }

  @Post('register')
  @Throttle({
    short: { limit: 3, ttl: 1000 },
    medium: { limit: 10, ttl: 60000 },
  })
  async register(@Body() body: RegisterDto) {
    if (body.password !== body.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const createUserDto = new CreateUserDto();
    createUserDto.name = body.name;
    createUserDto.email = body.username;
    createUserDto.password = await bcrypt.hash(body.password, 10);
    createUserDto.role = Role.Owner;
    createUserDto.createdBy = NIL;
    const user = await this.dataSource.transaction(async (manager) => {
      const user = await this.UsersService.createWithManager(
        createUserDto,
        manager,
      );
      return user;
    });
    return await this.authService.login(user);
  }
}
