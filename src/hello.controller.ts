import { Controller, Get } from '@nestjs/common';

interface IHelloWorld {
   readonly hello: string;
}

@Controller()
export class HelloController
{
   @Get('hello')
   public  hello(): IHelloWorld
   {
      return {hello: 'World!'};
   }
}
