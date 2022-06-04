import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import type { FastifyReply } from 'fastify';

interface IClassValidatorErrorPayload {
   readonly message?: string[];
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter
{
   public catch(exception: any, host: ArgumentsHost): void
   {
      const ctx = host.switchToHttp();
      const res = ctx.getResponse<FastifyReply>();

      if (exception instanceof HttpException) {
         const errPayload = exception.getResponse() as IClassValidatorErrorPayload;
         const messages = errPayload?.message;
         if (Array.isArray(messages) && typeof messages[0] === 'string') {
            const concatedMessages = messages.join('; ');
            res.status(exception.getStatus()).send(new BadRequestException(concatedMessages));
            return;
         }

         res.status(exception.getStatus()).send(errPayload);
         return;
      }

      const errorMessage: string = typeof exception === 'string'
         ? exception
         : typeof exception?.message === 'string'
            ? exception.message
            : 'Неизвестная ошибка';

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(new InternalServerErrorException(errorMessage));
   }
}