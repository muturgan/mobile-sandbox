import { MultipartFile } from '@fastify/multipart';
import { ApiProperty } from '@nestjs/swagger';
import { computeFileUrl } from '../utils';

export interface IFileUrl {
   readonly fileUrl: string;
}

export class FileUrl implements IFileUrl {
   @ApiProperty({example: computeFileUrl({filename: 'example.txt'})})
   public readonly fileUrl: string;

   constructor(file: MultipartFile) {
      this.fileUrl = computeFileUrl(file);
   }
}
