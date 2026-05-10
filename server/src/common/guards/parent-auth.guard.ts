import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ParentAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const parentToken = request.headers['x-parent-token'];

    if (!parentToken) {
      throw new UnauthorizedException('需要家长密码验证');
    }

    try {
      const secret = this.configService.getOrThrow<string>('PARENT_JWT_SECRET');
      const payload = jwt.verify(parentToken as string, secret);
      request.parentVerified = payload;
      return true;
    } catch {
      throw new UnauthorizedException('家长验证令牌无效或已过期');
    }
  }
}
