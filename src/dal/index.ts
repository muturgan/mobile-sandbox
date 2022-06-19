import { Injectable } from '@nestjs/common';
import { AuthorRepository } from './models/author.repository';
import { BookRepository } from './models/book.repository';
import { UserRepository } from './models/user.repository';

export { IUser, IJwtPayload } from './models/user.repository';

@Injectable()
export class Dal {
   constructor(
      public readonly users: UserRepository,
      public readonly authors: AuthorRepository,
      public readonly books: BookRepository,
   ) {}
}