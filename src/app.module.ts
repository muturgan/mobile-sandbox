import { Module } from '@nestjs/common';
import { HelloController, FaviconController, AuthController } from './controllers';
import { Dal } from './dal';
import { JwtAuthGuard, JwtService } from './providers';
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
