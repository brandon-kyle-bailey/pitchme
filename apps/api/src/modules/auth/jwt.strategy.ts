import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(UsersService) private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('API_SECRET')!,
    });
  }

  async validate(payload: {
    sub: string;
    username: string;
    role: string;
    accountId: string;
  }) {
    const foundUser = await this.userService.findOneByAccountId(payload.sub);

    if (!foundUser) {
      throw new UnauthorizedException();
    }
    return {
      id: payload.sub,
      email: payload.username,
      role: payload.role,
      accountId: payload.accountId,
    };
  }
}
