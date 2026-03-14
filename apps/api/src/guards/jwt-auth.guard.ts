import { Injectable } from '@nestjs/common';
import { AuthGuard as SuperAuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends SuperAuthGuard('jwt') {}
