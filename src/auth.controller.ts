import { Body, ConflictException, Controller, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { Dal } from './dal';
import { AuthorisationDto, LoginResult, Success, SuccessResult } from './dto';
import crypto = require('crypto');
import { JwtService } from './jwt.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';


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
   @ApiResponse({ status: HttpStatus.OK, type: SuccessResult })
   public async registration(@Body() body: AuthorisationDto): Promise<SuccessResult>
   {
      const user = await this.dal.findByLogin(body.login);
      if (user !== null) {
         throw new ConflictException('Пользователь с таким именем уже зарегистрирован');
      }

      const hashedPassword = crypto.createHash('sha256')
         .update(body.password)
         .digest('base64url');

      await this.dal.add({ login: body.login, password: hashedPassword });

      return new Success();
   }

   @Post('login')
   @HttpCode(HttpStatus.OK)
   @ApiResponse({ status: HttpStatus.OK, type: LoginResult })
   public async login(@Body() body: AuthorisationDto): Promise<LoginResult>
   {
      const user = await this.dal.findByLogin(body.login);
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
