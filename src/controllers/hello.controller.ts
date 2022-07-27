import { Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AUTH_HEADER, File, JwtAuthGuard, UploadGuard } from '../providers';
import { FileUrl, HelloWorld, HttpExceptionExample } from '../dto';
import { MultipartFile } from '@fastify/multipart';
import { writeFileOnDisk } from '../utils';

@ApiTags('hello world')
@Controller('api')
export class HelloController
{
   @Get('hello')
   @ApiOperation({summary: 'Возвращает один и тот же ответ'})
   @ApiResponse({status: HttpStatus.OK, type: HelloWorld})
   public  hello(): HelloWorld
   {
      return {hello: 'World!'};
   }

   @Get('hello-wth-auth')
   @ApiOperation({summary: 'Возвращает один и тот же ответ, но только для залогиненых пользователей'})
   @ApiBearerAuth(AUTH_HEADER)
   @ApiHeader({ name: AUTH_HEADER, required: true, description: 'авторизационный заголовок' })
   @UseGuards(JwtAuthGuard)
   @ApiResponse({status: HttpStatus.OK, type: HelloWorld})
   public  helloWithAuth(): HelloWorld
   {
      return {hello: 'Auth!'};
   }

   @Post('just-upload')
   @ApiOperation({summary: 'Загружает файл на сервер'})
   @ApiHeader({ name: 'Content-Type', required: true, description: 'multipart/form-data' })
   @UseGuards(UploadGuard)
   @HttpCode(HttpStatus.OK)
   @ApiResponse({ status: HttpStatus.OK, type: FileUrl })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: HttpExceptionExample })
   public async uploadFile(@File() file: MultipartFile): Promise<FileUrl> {
      await writeFileOnDisk(file);
      return new FileUrl(file);
   }
}
