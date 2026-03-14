import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { User } from '../users/entities/user.domain';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(UsersService) private usersService: UsersService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(username);
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      sub: user.account_id,
      username: user.email,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('API_SECRET'),
      expiresIn: '15m',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('API_SECRET'),
      expiresIn: '7d',
    });

    const hashedToken = await bcrypt.hash(refresh_token, 10);
    const dto = new UpdateUserDto();
    dto.refresh_token = hashedToken;
    await this.usersService.update(user.id, dto);

    return { access_token, refresh_token };
  }

  async refresh(refreshToken: string) {
    try {
      const payload: {
        sub: string;
        username: string;
        role: string;
      } = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('API_SECRET'),
      });

      const user = await this.usersService.findOneByAccountId(payload.sub);
      if (!user || !(await bcrypt.compare(refreshToken, user.refreshToken!))) {
        throw new UnauthorizedException();
      }

      const newAccessToken = this.jwtService.sign(
        {
          sub: user.account_id,
          username: user.email,
          role: user.role,
        },
        {
          secret: this.configService.get<string>('API_SECRET')!,
          expiresIn: '15m',
        },
      );

      const newRefreshToken = this.jwtService.sign(
        {
          sub: user.account_id,
          username: user.email,
          role: user.role,
        },
        {
          secret: this.configService.get<string>('API_SECRET'),
          expiresIn: '7d',
        },
      );

      const newHashedToken = await bcrypt.hash(newRefreshToken, 10);
      const dto = new UpdateUserDto();
      dto.refresh_token = newHashedToken;
      await this.usersService.update(user.id, dto);

      return { access_token: newAccessToken, refresh_token: newRefreshToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
