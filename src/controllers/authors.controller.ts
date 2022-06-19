import { BadRequestException, Body, ConflictException, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorsList, HttpExceptionExample, NewAuthorBody, UpdateAuthorBody, Success, SuccessResult, NewId, AuthorWithBookIds } from '../dto';
import { AUTH_HEADER, JwtAuthGuard } from '../providers';
import { Dal } from '../dal';


@ApiTags('авторы')
@Controller('api/authors')
export class AuthorsController
{
   constructor(
      private readonly dal: Dal,
   ) {}

   @Get()
   @ApiOperation({summary: 'Возвращает список авторов'})
   @ApiResponse({status: HttpStatus.OK, type: AuthorsList})
   public async list(): Promise<AuthorsList>
   {
      const authors = await this.dal.authors.list();
      return { authors };
   }

   @Get(':ID')
   @ApiParam({name: 'ID', type: 'integer', description: 'ID автора', example: 1})
   @ApiOperation({summary: 'Возвращает авторова по его ID'})
   @ApiResponse({status: HttpStatus.OK, type: AuthorWithBookIds})
   @ApiResponse({status: HttpStatus.NOT_FOUND, type: HttpExceptionExample})
   public async find(@Param('ID') ID: string): Promise<AuthorWithBookIds>
   {
      const author = await this.dal.authors.findWithBookIds(Number(ID));
      if (author === null) {
         throw new NotFoundException(`Автор с ID ${ID} не существует`);
      }
      return author;
   }

   @Post()
   @ApiBody({type: NewAuthorBody})
   @ApiOperation({summary: 'Создаёт нового авторова'})
   @ApiBearerAuth(AUTH_HEADER)
   @ApiHeader({ name: AUTH_HEADER, required: true, description: 'авторизационный заголовок' })
   @UseGuards(JwtAuthGuard)
   @ApiResponse({status: HttpStatus.CREATED, type: NewId})
   @ApiResponse({status: HttpStatus.BAD_REQUEST, type: HttpExceptionExample})
   public async create(@Body() body: NewAuthorBody): Promise<NewId>
   {
      const existingAuthor = await this.dal.authors.findByName(body.name);
      if (existingAuthor !== null) {
         throw new ConflictException(`Автор с именем ${body.name} уже существует`);
      }

      const id = await this.dal.authors.add(body);
      return new NewId(id);
   }

   @Put(':ID')
   @ApiParam({name: 'ID', type: 'integer', description: 'ID автора', example: 1})
   @ApiBody({type: UpdateAuthorBody})
   @ApiOperation({summary: 'Обновляет данные авторова'})
   @ApiBearerAuth(AUTH_HEADER)
   @ApiHeader({ name: AUTH_HEADER, required: true, description: 'авторизационный заголовок' })
   @UseGuards(JwtAuthGuard)
   @ApiResponse({status: HttpStatus.OK, type: SuccessResult})
   @ApiResponse({status: HttpStatus.BAD_REQUEST, type: HttpExceptionExample})
   public async update(@Param('ID') ID: string, @Body() body: UpdateAuthorBody): Promise<SuccessResult>
   {
      const authorToEdit = await this.find(ID);

      const mayBeName = body?.name;
      if (mayBeName) {
         const existingAuthor = await this.dal.authors.findByName(mayBeName);
         if (existingAuthor !== null && existingAuthor.ID !== authorToEdit.ID) {
            throw new ConflictException(`Автор с именем ${mayBeName} уже существует`);
         }
      }

      await this.dal.authors.update(Number(ID), body);
      return new Success();
   }

   @Delete(':ID')
   @ApiParam({name: 'ID', type: 'integer', description: 'ID автора', example: 1})
   @ApiOperation({summary: 'Удаляет авторова'})
   @ApiBearerAuth(AUTH_HEADER)
   @ApiHeader({ name: AUTH_HEADER, required: true, description: 'авторизационный заголовок' })
   @UseGuards(JwtAuthGuard)
   @ApiResponse({status: HttpStatus.OK, type: SuccessResult})
   @ApiResponse({status: HttpStatus.BAD_REQUEST, type: HttpExceptionExample})
   public async delete(@Param('ID') ID: string): Promise<SuccessResult>
   {
      const authorToDelete = await this.find(ID);
      const books = await this.dal.books.listByAuthorId(authorToDelete.ID);
      if (books.length > 0) {
         throw new BadRequestException(`У автора с ID ${ID} в системе существуют книги`);
      }

      await this.dal.authors.delete(authorToDelete.ID);
      return new Success();
   }
}
