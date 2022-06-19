import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { IEntity, Repository } from './abstract.repository';
import { AuthorRepository, IAuthor } from './author.repository';

export interface INewBook {
   readonly authorId: number;
   readonly isbn: string;
   readonly name: string;
   readonly publishingYear: number;
}

export interface IBook extends IEntity, INewBook {}

export interface IBookWithAuthor extends IEntity, Omit<INewBook, 'authorId'> {
   readonly author: IAuthor;
}

@Injectable()
export class BookRepository extends Repository<INewBook>
{
   constructor(
      @Inject(forwardRef(() => AuthorRepository))
      private readonly authorRepository: AuthorRepository,
   ) {
      super();
   }

   public async findWithBooks(ID: number): Promise<IBookWithAuthor | null> {
      const book = await this.find(ID);
      if (book === null) {
         return book;
      }

      const author = await this.authorRepository.find(book.authorId);
      if (author === null) {
         throw new Error(`inconsistene data. can't find a book's author`);
      }

      return {
         ID: book.ID,
         isbn: book.isbn,
         name: book.name,
         publishingYear: book.publishingYear,
         author,
      };
   }

   public async listWithBooks(): Promise<IBookWithAuthor[]> {
      const books = await this.list();

      return Promise.all(
         books.map((b) => this.bookToBookWithAuthor(b)),
      );
   }

   public async listByAuthorId(authorId: number): Promise<IBook[]> {
      const books = await this.list();
      return books.filter((b) => b.authorId === authorId);
   }

   public async listWithBooksByAuthorId(authorId: number): Promise<IBookWithAuthor[]> {
      const books = await this.listByAuthorId(authorId);

      return Promise.all(
         books.map((b) => this.bookToBookWithAuthor(b)),
      );
   }

   private async bookToBookWithAuthor(book: IBook): Promise<IBookWithAuthor> {
      const author = await this.authorRepository.find(book.authorId);
      if (author === null) {
         throw new Error(`inconsistene data. can't find a book's author`);
      }

      return {
         ID: book.ID,
         isbn: book.isbn,
         name: book.name,
         publishingYear: book.publishingYear,
         author,
      };
   }
}