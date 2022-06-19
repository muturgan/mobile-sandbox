import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { IEntity, Repository } from './abstract.repository';
import { BookRepository, IBook } from './book.repository';

export interface INewAuthor {
   readonly name: string;
   readonly birthYear: number;
}

export interface IAuthor extends IEntity, INewAuthor {}

export interface IAuthorWithBookIds extends IEntity, INewAuthor {
   readonly bookIds: ReadonlyArray<number>;
}

export interface IAuthorWithBooks extends IEntity, INewAuthor {
   readonly books: ReadonlyArray<IBook>;
}

@Injectable()
export class AuthorRepository extends Repository<INewAuthor>
{
   constructor(
      @Inject(forwardRef(() => BookRepository))
      private readonly bookRepository: BookRepository,
   ) {
      super();
   }

   public async findWithBookIds(ID: number): Promise<IAuthorWithBookIds | null> {
      const author = await this.find(ID);
      if (author === null) {
         return author;
      }

      const books = await this.bookRepository.list();
      const bookIds = books
         .filter((b) => b.authorId === author.ID)
         .map(((b) => b.ID));

      return {...author, bookIds};
   }

   public async findWithBooks(ID: number): Promise<IAuthorWithBooks | null> {
      const author = await this.find(ID);
      if (author === null) {
         return author;
      }

      const books = await this.bookRepository.list();
      const filteredBooks = books.filter((b) => b.authorId === author.ID);

      return {...author, books: filteredBooks};
   }

   public async listWithBookIds(): Promise<IAuthorWithBookIds[]> {
      const [authors, books] = await Promise.all([
         this.list(),
         this.bookRepository.list(),
      ]);

      return authors.map<IAuthorWithBookIds>((a) => {
         const bookIds = books
            .filter((b) => b.authorId === a.ID)
            .map((b) => b.ID);

         return {...a, bookIds};
      });
   }

   public async listWithBooks(): Promise<IAuthorWithBooks[]> {
      const [authors, books] = await Promise.all([
         this.list(),
         this.bookRepository.list(),
      ]);

      return authors.map<IAuthorWithBooks>((a) => {
         const filtered = books
            .filter((b) => b.authorId === a.ID);

         return {...a, books: filtered};
      });
   }
}