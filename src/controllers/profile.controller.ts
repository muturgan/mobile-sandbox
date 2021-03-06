import { MultipartFile } from '@fastify/multipart';
import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put, UnsupportedMediaTypeException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpExceptionExample, ProfileToShow, Success, SuccessResult, UpdateProfileBody } from '../dto';
import { AUTH_HEADER, JwtAuthGuard, UserId, UploadGuard, File } from '../providers';
import { computeFileUrl, IMAGE_MINETYPES, writeFileOnDisk } from '../utils';
import { Dal } from '../dal';


@ApiTags('профиль пользователя')
@Controller('api/profile')
export class ProfileController
{
   constructor(
      private readonly dal: Dal,
   ) {}

   @Get('my')
   @ApiOperation({summary: 'Возвращает профиль пользователя на основании сессии'})
   @ApiBearerAuth(AUTH_HEADER)
   @ApiHeader({ name: AUTH_HEADER, required: true, description: 'авторизационный заголовок' })
   @UseGuards(JwtAuthGuard)
   @ApiResponse({ status: HttpStatus.OK, type: ProfileToShow })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: HttpExceptionExample })
   public async readMy(@UserId() ID: number): Promise<ProfileToShow>
   {
      const profile = await this.dal.users.find(ID);
      if (profile === null) {
         throw new NotFoundException(`Пользователь с ID ${ID} не существует`);
      }

      return new ProfileToShow(profile);
   }

   @Get(':ID')
   @ApiOperation({summary: 'Возвращает профиль пользователя по ID'})
   @ApiParam({name: 'ID', type: 'integer', description: 'ID пользователя', example: 1})
   @ApiResponse({ status: HttpStatus.OK, type: ProfileToShow })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: HttpExceptionExample })
   public async read(@Param('ID') ID: string): Promise<ProfileToShow>
   {
      const profile = await this.dal.users.find(Number(ID));
      if (profile === null) {
         throw new NotFoundException(`Пользователь с ID ${ID} не существует`);
      }

      return new ProfileToShow(profile);
   }

   @Put()
   @ApiOperation({summary: 'Обновляет профиль пользователя'})
   @ApiBody({type: UpdateProfileBody})
   @ApiBearerAuth(AUTH_HEADER)
   @ApiHeader({ name: AUTH_HEADER, required: true, description: 'авторизационный заголовок' })
   @UseGuards(JwtAuthGuard)
   @ApiResponse({ status: HttpStatus.OK, type: SuccessResult })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: HttpExceptionExample })
   public async update(@UserId() ID: number, @Body() body: UpdateProfileBody): Promise<SuccessResult>
   {
      const profile = await this.dal.users.find(ID);
      if (profile === null) {
         throw new NotFoundException(`Пользователь с ID ${ID} не существует`);
      }

      await this.dal.users.update(ID, body);

      return new Success();
   }

   @Post('upload-avatar')
   @ApiOperation({summary: 'Загружает изображение на сервер и устанавливает его в качестве аватарки'})
   @ApiBearerAuth(AUTH_HEADER)
   @ApiHeader({ name: AUTH_HEADER, required: true, description: 'авторизационный заголовок' })
   @ApiHeader({ name: 'Content-Type', required: true, description: 'multipart/form-data' })
   @UseGuards(JwtAuthGuard, UploadGuard)
   @HttpCode(HttpStatus.OK)
   @ApiResponse({ status: HttpStatus.OK, type: SuccessResult })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: HttpExceptionExample })
   public async uploadAvatar(@UserId() ID: number, @File() file: MultipartFile): Promise<SuccessResult> {
      if (!IMAGE_MINETYPES.includes(file.mimetype)) {
         throw new UnsupportedMediaTypeException('Пожалуйста загрузите файл изображения');
      }

      const profile = await this.dal.users.find(ID);
      if (profile === null) {
         throw new NotFoundException(`Пользователь с ID ${ID} не существует`);
      }

      await writeFileOnDisk(file);

      const avatarUrl = computeFileUrl(file);
      await this.dal.users.update(ID, {avatarUrl});

      return new Success();
   }
}
