import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { IRequestWithFile } from './file.decorator';

@Injectable()
export class UploadGuard implements CanActivate {
   public async canActivate(ctx: ExecutionContext): Promise<boolean> {
      const req = ctx.switchToHttp().getRequest<IRequestWithFile>();
      const isMultipart = req.isMultipart();
      if (!isMultipart) {
         throw new BadRequestException('multipart/form-data expected.');
      }
      const file = await req.file();
      if (!file) {
         throw new BadRequestException('file expected');
      }

      req.incomingFile = file;
      return true;
   }
}
