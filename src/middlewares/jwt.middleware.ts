import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { loadJwtConstant } from '@utils/loadJwtConstant';
import { NextFunction } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeaders(req.headers);

    if (token) {
      try {
        const user = this.jwtService.verifyAsync(token, {
          secret: loadJwtConstant(this.configService),
        });
        req['user'] = user;
        next();
      } catch {
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeaders(headers: any): string | null {
    const authorizationHeader = headers['authorization'];

    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      // Если заголовок 'Authorization' начинается с 'Bearer ', извлекаем токен.
      const token = authorizationHeader.slice(7);
      return token;
    }

    return null;
  }
}
