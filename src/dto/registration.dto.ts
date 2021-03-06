import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { IEntity } from '../dal/models/abstract.repository';
import { EGender, IProfile, IProfileToShow } from '../dal/models/user.repository';
import { hashPassword } from '../utils';

export class RegistrationDto implements IProfile {
   public readonly userName = null;
   public readonly avatarUrl = null;
   public readonly birthDate = null;
   public readonly gender = null;

   public readonly login: string;
   public readonly password: string;

   constructor(login: string, password: string) {
      this.login = login;
      this.password = hashPassword(password);
   }
}

export class ProfileToShow implements IProfileToShow {
   @ApiProperty({type: Number, example: 1})
   public readonly ID!: number;

   @ApiProperty({type: String})
   public readonly login!: string;

   @ApiPropertyOptional({type: String})
   public readonly userName!: string | null;

   @ApiPropertyOptional({type: String, example: 'https://daly-telecom.cf/images/1.jpg', nullable: true})
   public readonly avatarUrl!: string | null;

   @ApiPropertyOptional({type: String, example: '1987-04-26', nullable: true})
   public readonly birthDate!: string | null;

   @ApiPropertyOptional({enum: EGender, nullable: true})
   public readonly gender!: EGender | null;

   constructor(profile: IProfile & IEntity) {
      this.ID = profile.ID;
      this.login = profile.login;
      this.userName = profile.userName;
      this.avatarUrl = profile.avatarUrl;
      this.birthDate = profile.birthDate;
      this.gender = profile.gender;
   }
}

export class UpdateProfileBody {
   @ApiPropertyOptional({type: String, nullable: true})
   @IsString()
   @IsOptional()
   public readonly userName?: string;

   @ApiPropertyOptional({type: String, example: 'https://daly-telecom.cf/images/1.jpg', nullable: true})
   @IsUrl()
   @IsOptional()
   public readonly avatarUrl?: string | null;

   @ApiPropertyOptional({type: String, example: '1987-04-26', nullable: true})
   @IsDateString()
   @IsOptional()
   public readonly birthDate?: string | null;

   @ApiPropertyOptional({enum: EGender, nullable: true})
   @IsEnum(EGender, {message: `???????? gender ?????????? ?????????????????? ???????????????? '${EGender.MALE}' ?? '${EGender.FEMALE}'`})
   @IsOptional()
   public readonly gender?: EGender | null;
}
