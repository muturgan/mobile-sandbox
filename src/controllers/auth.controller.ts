import { Body, ConflictException, Controller, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorisationDto, HttpExceptionExample, LoginResult, NewId, RegistrationDto } from '../dto';
import { JwtService } from '../providers';
import { Dal } from '../dal';
import crypto = require('crypto');


@ApiTags('авторизация')
@Controller('api')
export class AuthController
{
   constructor(
      private readonly dal: Dal,
      private readonly jwt: JwtService,
   ) {}

   @Post('registration')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({summary: 'Пегистрация нового пользователя'})
   @ApiResponse({ status: HttpStatus.OK, type: NewId })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: HttpExceptionExample })
   public async registration(@Body() body: AuthorisationDto): Promise<NewId>
   {
      const user = await this.dal.users.findByLogin(body.login);
      if (user !== null) {
         throw new ConflictException('Пользователь с таким именем уже зарегистрирован');
      }

      const id = await this.dal.users.add(new RegistrationDto(body.login, body.password));

      return new NewId(id);
   }

   @Post('login')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({summary: 'Вход в систему. Время жизни сессии - 5 минут'})
   @ApiResponse({ status: HttpStatus.OK, type: LoginResult })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: HttpExceptionExample })
   public async login(@Body() body: AuthorisationDto): Promise<LoginResult>
   {
      const user = await this.dal.users.findByLogin(body.login);
      if (user === null) {
         throw new UnauthorizedException('Неверный логин или пароль');
      }

      const hashedPassword = crypto.createHash('sha256')
         .update(body.password)
         .digest('base64url');

      if (user.password !== hashedPassword) {
         throw new UnauthorizedException('Неверный логин или пароль');
      }

      const token = await this.jwt.generateToken(user);

      return new LoginResult(token);
   }
}
