import { MultipartFile } from '@fastify/multipart';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export interface IRequestWithFile extends FastifyRequest {
   incomingFile: MultipartFile;
}

export const File = createParamDecorator(
   (_data: unknown, ctx: ExecutionContext) => {
      return ctx.switchToHttp().getRequest<IRequestWithFile>().incomingFile;
   },
);