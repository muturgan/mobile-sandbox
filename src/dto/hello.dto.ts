import { ApiProperty } from '@nestjs/swagger';

export interface IHelloWorld {
   readonly hello: string;
}

export class HelloWorld implements IHelloWorld {
   @ApiProperty()
   public readonly hello: string;

   constructor(hello: string) {
      this.hello = hello;
   }
}
