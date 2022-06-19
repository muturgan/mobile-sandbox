import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AUTH_HEADER, JwtAuthGuard } from '../providers';
import { HelloWorld } from '../dto';

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
}
