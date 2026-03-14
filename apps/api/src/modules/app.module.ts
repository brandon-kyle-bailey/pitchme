import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { Keyv } from 'keyv';
import { CacheableMemory } from 'cacheable';
import KeyvRedis from '@keyv/redis';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>(
          'DATABASE_URL',
          'postgresql://postgres:postgres@postgres:5432/db',
        ),
        entities: [User],
        synchronize: process.env.NODE_ENV !== 'production',
        autoLoadEntities: true,
        retryAttempts: 10,
        retryDelay: 5000,
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (configService: ConfigService) => {
        const url = configService.get<string>(
          'REDIS_URL',
          'redis://redis:6379',
        );
        return {
          stores: [
            new Keyv({ store: new KeyvRedis(url), ttl: 5_000 }),
            new Keyv({
              store: new CacheableMemory({ ttl: 5_000, lruSize: 5_000 }),
            }),
          ],
        };
      },
    }),
    HttpModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    CqrsModule.forRoot(),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 9999999999,
          ttl: 6000,
        },
      ],
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
