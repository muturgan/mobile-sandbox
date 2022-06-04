import { CanActivate, ExecutionContext, Injectable, HttpException, UnauthorizedException } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { JwtService } from './jwt.service';
import { TokenExpiredError } from 'jsonwebtoken';

export class SessionExpiredExcepion extends HttpException {
   constructor() {
      super({
         statusCode: 419,
         message: 'Время сессии истекло. Повторно войдите в систему.',
         error: 'Session Expired',
      }, 419);
   }
}

export const AUTH_HEADER = 'authorization';


@Injectable()
export class JwtAuthGuard implements CanActivate
{
   constructor(
      private readonly jwt: JwtService,
   ) {}

   public async canActivate(ctx: ExecutionContext): Promise<boolean> {
      try {
         const req = ctx.switchToHttp().getRequest<FastifyRequest>();

         const authHeader = req.headers[AUTH_HEADER];
         if (typeof authHeader !== 'string') {
            throw new UnauthorizedException();
         }

         await this.jwt.verufyToken(authHeader);

         return true;
      }
      catch (err) {
         throw err instanceof TokenExpiredError
            ? new SessionExpiredExcepion()
            : err instanceof HttpException
               ? err
               : new UnauthorizedException();
      }
   }
}