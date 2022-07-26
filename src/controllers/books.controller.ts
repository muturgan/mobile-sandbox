import { Body, ConflictException, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpExceptionExample, Success, SuccessResult, NewId, BooksList, BookWithAuthor, NewBookBody, UpdateBookBody } from '../dto';
import { AUTH_HEADER, JwtAuthGuard } from '../providers';
import { Dal } from '../dal';


@ApiTags('книги')
@Controller('api/books')
export class BooksController
{
   constructor(
      private readonly dal: Dal,
   ) {}

   @Get()
   @ApiOperation({summary: 'Возвращает список книг'})
   @ApiResponse({status: HttpStatus.OK, type: BooksList})
   public async list(): Promise<BooksList>
   {
      const books = await this.dal.books.list();
      return { books };
   }

   @Get(':ID')
   @ApiParam({name: 'ID', type: 'integer', description: 'ID книги', example: 1})
   @ApiOperation({summary: 'Возвращает книгу по её ID'})
   @ApiResponse({status: HttpStatus.OK, type: BookWithAuthor})
   @ApiResponse({status: HttpStatus.NOT_FOUND, type: HttpExceptionExample})
   public async find(@Param('ID') ID: string): Promise<BookWithAuthor>
   {
      const book = await this.dal.books.findWithAuthor(Number(ID));
      if (book === null) {
         throw new NotFoundException(`Книга с ID ${ID} не существует`);
      }
      return book;
   }

   @Post()
   @ApiBody({type: NewBookBody})
   @ApiOperation({summary: 'Создаёт новую книгу'})
   @ApiBearerAuth(AUTH_HEADER)
   @ApiHeader({ name: AUTH_HEADER, required: true, description: 'авторизационный заголовок' })
   @UseGuards(JwtAuthGuard)
   @ApiResponse({status: HttpStatus.CREATED, type: NewId})
   @ApiResponse({status: HttpStatus.BAD_REQUEST, type: HttpExceptionExample})
   public async create(@Body() body: NewBookBody): Promise<NewId>
   {
      const books = await this.dal.books.list();
      const existingBook = books.find((b) => b.authorId === body.authorId && b.isbn === body.isbn && b.name === body.isbn && b.publishingYear === body.publishingYear);
      if (existingBook !== undefined) {
         throw new ConflictException(`Книга с такими параметрами уже существует`);
      }

      const id = await this.dal.books.add(body);
      return new NewId(id);
   }

   @Put(':ID')
   @ApiParam({name: 'ID', type: 'integer', description: 'ID книги', example: 1})
   @ApiBody({type: UpdateBookBody})
   @ApiOperation({summary: 'Обновляет данные книги'})
   @ApiBearerAuth(AUTH_HEADER)
   @ApiHeader({ name: AUTH_HEADER, required: true, description: 'авторизационный заголовок' })
   @UseGuards(JwtAuthGuard)
   @ApiResponse({status: HttpStatus.OK, type: SuccessResult})
   @ApiResponse({status: HttpStatus.BAD_REQUEST, type: HttpExceptionExample})
   public async update(@Param('ID') ID: string, @Body() body: UpdateBookBody): Promise<SuccessResult>
   {
      const bookToEdit = await this.dal.books.find(Number(ID));
      if (bookToEdit === null) {
         throw new NotFoundException(`Книга с ID ${ID} не существует`);
      }

      const merged = {...bookToEdit};
      Object.keys(body).forEach((key) => {
         // @ts-ignore
         const newValue = body?.[key];
         if (newValue) {
            // @ts-ignore
            merged[key] = newValue;
         }
      });

      const books = await this.dal.books.list();
      const existingBook = books.find((b) => b.authorId === merged.authorId && b.isbn === merged.isbn && b.name === merged.isbn && b.publishingYear === merged.publishingYear);
      if (existingBook !== undefined) {
         throw new ConflictException(`Книга с такими параметрами уже существует`);
      }

      await this.dal.authors.update(Number(ID), body);
      return new Success();
   }

   @Delete(':ID')
   @ApiParam({name: 'ID', type: 'integer', description: 'ID книги', example: 1})
   @ApiOperation({summary: 'Удаляет книгу'})
   @ApiBearerAuth(AUTH_HEADER)
   @ApiHeader({ name: AUTH_HEADER, required: true, description: 'авторизационный заголовок' })
   @UseGuards(JwtAuthGuard)
   @ApiResponse({status: HttpStatus.OK, type: SuccessResult})
   @ApiResponse({status: HttpStatus.BAD_REQUEST, type: HttpExceptionExample})
   public async delete(@Param('ID') ID: string): Promise<SuccessResult>
   {
      const bookToDelete = await this.find(ID);
      await this.dal.books.delete(bookToDelete.ID);
      return new Success();
   }
}
