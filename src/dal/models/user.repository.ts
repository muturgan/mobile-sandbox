import { Injectable } from '@nestjs/common';
import { IEntity, Repository } from './abstract.repository';

export interface IJwtPayload {
   readonly userNume: string;
}

export interface INewUser {
   readonly login: string;
   readonly password: string;
}

export interface IUser extends IEntity, INewUser {}

@Injectable()
export class UserRepository extends Repository<INewUser>
{
   public findByLogin(login: string): Promise<IUser | null> {
      const user = this.store.find((u) => u.login === login);
      return Promise.resolve(user || null);
   }
}