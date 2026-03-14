import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/modules/users/entities/user.domain';

@Injectable()
export class ControllerCacheInterceptor extends CacheInterceptor {
  constructor(cacheManager: any, reflector: Reflector) {
    super(cacheManager, reflector);
  }

  trackBy(context: ExecutionContext): string | undefined {
    const baseKey = super.trackBy(context);
    if (!baseKey) return undefined;
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: User }>();
    const userId = request.user?.id;
    const key = userId ? `${userId}:${baseKey}` : baseKey;
    console.log(`cache key: ${key}`);
    return key;
  }
}
