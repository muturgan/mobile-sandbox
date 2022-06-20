import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { IEntity } from '../dal/models/abstract.repository';
import { EGender, IProfile, IProfileToShow } from '../dal/models/user.repository';
import crypto = require('crypto');

export class RegistrationDto implements IProfile {
   public readonly avatarUrl = null;
   public readonly birthDate = null;
   public readonly gender = null;

   public readonly userNume: string;
   public readonly password: string;

   constructor(login: string, password: string) {
      this.userNume = login;

      const hashedPassword = crypto.createHash('sha256')
         .update(password)
         .digest('base64url');

      this.password = hashedPassword;
   }
}

export class ProfileToShow implements IProfileToShow {
   @ApiProperty({type: Number, example: 1})
   public readonly ID!: number;

   @ApiProperty({type: String})
   public readonly userNume!: string;

   @ApiPropertyOptional({type: String, example: 'https://daly-telecom.cf/images/1.jpg', nullable: true})
   public readonly avatarUrl!: string | null;

   @ApiPropertyOptional({type: String, example: '1987-04-26', nullable: true})
   public readonly birthDate!: string | null;

   @ApiPropertyOptional({enum: EGender, nullable: true})
   public readonly gender!: EGender | null;

   constructor(profile: IProfile & IEntity) {
      this.ID = profile.ID;
      this.userNume = profile.userNume;
      this.avatarUrl = profile.avatarUrl;
      this.birthDate = profile.birthDate;
      this.gender = profile.gender;
   }
}

export class UpdateProfileBody {
   @ApiPropertyOptional({type: String, nullable: true})
   @IsString()
   @IsOptional()
   public readonly userNume?: string;

   @ApiPropertyOptional({type: String, example: 'https://daly-telecom.cf/images/1.jpg', nullable: true})
   @IsUrl()
   @IsOptional()
   public readonly avatarUrl?: string | null;

   @ApiPropertyOptional({type: String, example: '1987-04-26', nullable: true})
   @IsDateString()
   @IsOptional()
   public readonly birthDate?: string | null;

   @ApiPropertyOptional({enum: EGender, nullable: true})
   @IsEnum(EGender, {message: `поле gender может принимать значения '${EGender.MALE}' и '${EGender.FEMALE}'`})
   @IsOptional()
   public readonly gender?: EGender | null;
}
