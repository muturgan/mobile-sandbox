import { Body, Controller, Get, HttpStatus, NotFoundException, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpExceptionExample, ProfileToShow, Success, SuccessResult, UpdateProfileBody } from '../dto';
import { AUTH_HEADER, JwtAuthGuard, UserId } from '../providers';
import { Dal } from '../dal';


@ApiTags('профиль пользователя')
@Controller('api/profile')
export class ProfileController
{
   constructor(
      private readonly dal: Dal,
   ) {}

   @Get(':ID')
   @ApiOperation({summary: 'Возвращает профиль пользователя'})
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
}
