import { Module } from '@nestjs/common';
import { HelloController } from './hello.controller';
import { AuthController } from './auth.controller';
import { FaviconController } from './favicon.controller';
import { Dal } from './dal';
import { JwtService } from './jwt.service';
import { JwtAuthGuard } from './jwt.guard';
import { UserRepository } from './dal/models/user.repository';
import { AuthorRepository } from './dal/models/author.repository';
import { BookRepository } from './dal/models/book.repository';


@Module({
   controllers: [
      FaviconController,
      HelloController,
      AuthController,
   ],
   providers: [
      Dal,
      AuthorRepository,
      BookRepository,
      UserRepository,
      JwtService,
      JwtAuthGuard,
   ],
})
export class AppModule {}
