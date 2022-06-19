import { Injectable } from '@nestjs/common';
import { IEntity, Repository } from './abstract.repository';

export enum ESex {
   MALE = 'MALE',
   FEMALE = 'FEMALE',
}

export interface IJwtPayload {
   readonly ID: number;
   readonly userNume: string;
}

export interface INewUser {
   readonly userNume: string;
   readonly password: string;
}

export interface IProfile extends INewUser {
   readonly avatarUrl: string | null;
   readonly birthDate: string | null;
   readonly sex: ESex | null;
}

export interface IProfileToShow extends IEntity, Omit<IProfile, 'password'> {}

export interface IUser extends IEntity, INewUser {}

@Injectable()
export class UserRepository extends Repository<IProfile>
{
   public findByLogin(login: string): Promise<IUser | null> {
      const user = this.store.find((u) => u.userNume === login);
      return Promise.resolve(user || null);
   }
}