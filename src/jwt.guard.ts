import { CanActivate, ExecutionContext, Injectable, HttpException, UnauthorizedException } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { JwtService } from './jwt.service';
import { TokenExpiredError } from 'jsonwebtoken';

export class SessionExpiresExcepion extends HttpException {
   constructor() {
      super('Время сессии истекло. Повторно войдите в систему.', 419);
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
            ? new SessionExpiresExcepion()
            : err instanceof HttpException
               ? err
               : new UnauthorizedException();
      }
   }
}