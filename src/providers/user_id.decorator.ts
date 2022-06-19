import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { AUTH_HEADER } from './jwt.guard';
import jwt = require('jsonwebtoken');
import { IJwtPayload } from '../dal';

export const UserId = createParamDecorator<number>(
   (_data: unknown, ctx: ExecutionContext) => {
      const req = ctx.switchToHttp().getRequest<FastifyRequest>();

      const authHeader = req.headers[AUTH_HEADER];
      if (typeof authHeader !== 'string') {
         throw new UnauthorizedException();
      }

      const { ID } = jwt.decode(authHeader) as IJwtPayload;
      return ID;
   },
);