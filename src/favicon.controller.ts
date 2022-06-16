import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller()
@ApiExcludeController()
export class FaviconController
{
   @Get('favicon.ico')
   @HttpCode(HttpStatus.NO_CONTENT)
   public  hello(): void {}
}
