import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Config } from '../../config';

@Injectable()
export class SecretGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    const [_, token] = req.headers.authorization?.split(' ');

    Config.self.dynamic.secret = token;
    return true;
  }
}
