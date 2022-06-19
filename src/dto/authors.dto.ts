import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { IAuthor, IAuthorWithBookIds, INewAuthor } from '../dal/models/author.repository';

export abstract class Author implements IAuthor {
   @ApiProperty({description: 'ID автора', example: 1})
   public readonly ID!: number;

   @ApiProperty({description: 'Имя автора', example: 'Роберт Бёрнс'})
   public readonly name!: string;

   @ApiProperty({description: 'Год рождения автора', example: 1759})
   public readonly birthYear!: number;
}

export abstract class AuthorWithBookIds implements IAuthorWithBookIds {
   @ApiProperty({description: 'ID автора', example: 1})
   public readonly ID!: number;

   @ApiProperty({description: 'Имя автора', example: 'Роберт Бёрнс'})
   public readonly name!: string;

   @ApiProperty({description: 'Год рождения автора', example: 1759})
   public readonly birthYear!: number;

   @ApiProperty({description: 'Список ID книг автора', type: Number, isArray: true, example: [1, 2, 3]})
   public readonly bookIds!: ReadonlyArray<number>;
}

export abstract class AuthorsList {
   @ApiProperty({type: Author, isArray: true})
   public readonly authors!: Author[];
}

export abstract class NewAuthorBody implements INewAuthor {
   @ApiProperty({description: 'Имя автора', example: 'Роберт Бёрнс'})
   @IsString()
   @IsNotEmpty()
   public readonly name!: string;

   @ApiProperty({description: 'Год рождения автора', example: 1759})
   @IsInt()
   @IsPositive()
   @IsNumber()
   @IsNotEmpty()
   public readonly birthYear!: number;
}

export abstract class UpdateAuthorBody implements Partial<INewAuthor> {
   @ApiPropertyOptional({description: 'Имя автора', example: 'Роберт Бёрнс', nullable: true})
   @IsString()
   @IsOptional()
   public readonly name?: string;

   @ApiPropertyOptional({description: 'Год рождения автора', example: 1759, nullable: true})
   @IsInt()
   @IsPositive()
   @IsNumber()
   @IsOptional()
   public readonly birthYear?: number;
}
