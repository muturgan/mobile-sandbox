import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export abstract class AuthorisationDto {
   @ApiProperty()
   @IsString()
   @IsNotEmpty()
   public readonly login!: string;

   @ApiProperty()
   @IsString()
   @IsNotEmpty()
   public readonly password!: string;
}
