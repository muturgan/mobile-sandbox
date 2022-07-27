import { MultipartFile } from '@fastify/multipart';
import crypto = require('crypto');
import fs = require('fs');
import path = require('path');
import { config } from '../config';

export const hashPassword = (password: string) => crypto
   .createHash('sha256')
   .update(password)
   .digest('base64url');

export const FILE_STORE_DIR = 'files';
export const FILE_ROOT = path.join(process.cwd(), FILE_STORE_DIR);

export const IMAGE_MINETYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif'];

export const writeFileOnDisk = (file: MultipartFile): Promise<void> => {
   return new Promise<void>((resolve, reject) => {
      const fileStream = file.file;
      fileStream.on('error', reject);
      fileStream.on('end', resolve);

      fileStream.pipe(
         fs.createWriteStream(
            path.join(
               FILE_ROOT, file.filename,
            ),
         ),
      );

   });
};

export const computeFileUrl = (file: {filename: string}): string => {
   return `${ config.APP_DOMAIN }/${FILE_STORE_DIR}/${ file.filename }`;
};
