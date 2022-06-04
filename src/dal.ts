import { Injectable } from '@nestjs/common';

export interface IJwtPayload {
   readonly userNume: string;
}

export interface INewUser {
   readonly login: string;
   readonly password: string;
}

export interface IUser {
   readonly ID: number;
   readonly login: string;
   readonly password: string;
}

@Injectable()
export class Dal {
   private readonly store: IUser[] = [];

   public add(user: INewUser): Promise<number> {
      const ID = this.store.length + 1;
      this.store.push({ ID, ...user });
      return Promise.resolve(ID);
   }

   public find(userId: number): Promise<IUser | null> {
      const user = this.store[userId - 1];
      return Promise.resolve(user || null);
   }

   public findByLogin(login: string): Promise<IUser | null> {
      const user = this.store.find((u) => u.login === login);
      return Promise.resolve(user || null);
   }

   public list(): Promise<IUser[]> {
      return Promise.resolve(this.store);
   }

   public delete(userId: number): Promise<void> {
      delete this.store[userId];
      return Promise.resolve();
   }
}