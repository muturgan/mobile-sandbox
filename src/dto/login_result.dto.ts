import { ApiProperty } from '@nestjs/swagger';

export class LoginResult {
   @ApiProperty()
   public readonly token: string;

   constructor(token: string) {
      this.token = token;
   }
}