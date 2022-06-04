import { ApiProperty } from '@nestjs/swagger';

export interface ISuccess {
   readonly success: boolean;
}

export class SuccessResult implements ISuccess {
   @ApiProperty()
   public readonly success: boolean;

   constructor(success: boolean) {
      this.success = success;
   }
}

export class Success extends SuccessResult implements ISuccess {
   constructor() {
      super(true);
   }
}

export class Fail extends SuccessResult implements ISuccess {
   constructor() {
      super(false);
   }
}
