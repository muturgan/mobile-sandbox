import { ApiProperty } from '@nestjs/swagger';

export class NewId {
   @ApiProperty({example: 1})
   public readonly id: number;

   constructor(_id: number) {
      this.id = _id;
   }
}
