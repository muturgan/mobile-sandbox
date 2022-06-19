import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { IBook, IBookWithAuthor, INewBook } from '../dal/models/book.repository';
import { Author } from './authors.dto';

export abstract class Book implements IBook {
   @ApiProperty({description: 'ID книги', example: 1})
   public readonly ID!: number;

   @ApiProperty({description: 'ID автора', example: 1})
   public readonly authorId!: number;

   @ApiProperty({description: 'Международный стандартный книжный номер', example: '978-5-87107-298-1'})
   public readonly isbn!: string;

   @ApiProperty({description: 'Название книги', example: 'Джон Ячменное Зерно'})
   public readonly name!: string;

   @ApiProperty({description: 'Год публикации', example: 2012})
   public readonly publishingYear!: number;
}

export abstract class BookWithAuthor implements IBookWithAuthor {
   @ApiProperty({description: 'ID книги', example: 1})
   public readonly ID!: number;

   @ApiProperty({description: 'Международный стандартный книжный номер', example: '978-5-87107-298-1'})
   public readonly isbn!: string;

   @ApiProperty({description: 'Название книги', example: 'Джон Ячменное Зерно'})
   public readonly name!: string;

   @ApiProperty({description: 'Год публикации', example: 2012})
   public readonly publishingYear!: number;

   @ApiProperty({type: Author})
   public readonly author!: Author;
}

export abstract class BooksList {
   @ApiProperty({type: Book, isArray: true})
   public readonly books!: Book[];
}

export abstract class NewBookBody implements INewBook {
   @ApiProperty({description: 'ID автора', example: 1})
   @IsInt()
   @IsPositive()
   @IsNumber()
   @IsNotEmpty()
   public readonly authorId!: number;

   @ApiProperty({description: 'Международный стандартный книжный номер', example: '978-5-87107-298-1'})
   @IsString()
   @IsNotEmpty()
   public readonly isbn!: string;

   @ApiProperty({description: 'Название книги', example: 'Джон Ячменное Зерно'})
   @IsString()
   @IsNotEmpty()
   public readonly name!: string;

   @ApiProperty({description: 'Год публикации', example: 2012})
   @IsInt()
   @IsPositive()
   @IsNumber()
   @IsNotEmpty()
   public readonly publishingYear!: number;
}

export abstract class UpdateBookBody implements Partial<INewBook> {
   @ApiPropertyOptional({description: 'ID автора', example: 1, nullable: true})
   @IsInt()
   @IsPositive()
   @IsNumber()
   @IsOptional()
   public readonly authorId?: number;

   @ApiPropertyOptional({description: 'Международный стандартный книжный номер', example: '978-5-87107-298-1', nullable: true})
   @IsString()
   @IsOptional()
   public readonly isbn?: string;

   @ApiPropertyOptional({description: 'Название книги', example: 'Джон Ячменное Зерно', nullable: true})
   @IsString()
   @IsOptional()
   public readonly name?: string;

   @ApiPropertyOptional({description: 'Год публикации', example: 2012, nullable: true})
   @IsInt()
   @IsPositive()
   @IsNumber()
   @IsOptional()
   public readonly publishingYear?: number;
}