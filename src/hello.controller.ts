import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HelloWorld } from './dto';
import { AUTH_HEADER, JwtAuthGuard } from './jwt.guard';

@ApiTags('hello world')
@Controller()
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
   @ApiBearerAuth('authorization')
   @ApiHeader({ name: AUTH_HEADER })
   @UseGuards(JwtAuthGuard)
   @ApiResponse({status: HttpStatus.OK, type: HelloWorld})
   public  helloWithAuth(): HelloWorld
   {
      return {hello: 'Auth!'};
   }
}
