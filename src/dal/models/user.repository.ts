import { Injectable } from '@nestjs/common';
import { IEntity, Repository } from './abstract.repository';

export enum EGender {
   MALE = 'MALE',
   FEMALE = 'FEMALE',
}

export interface IJwtPayload {
   readonly ID: number;
   readonly login: string;
}

export interface INewUser {
   readonly login: string;
   readonly password: string;
}

export interface IProfile extends INewUser {
   readonly userNume: string | null;
   readonly avatarUrl: string | null;
   readonly birthDate: string | null;
   readonly gender: EGender | null;
}

export interface IProfileToShow extends IEntity, Omit<IProfile, 'password'> {}

export interface IUser extends IEntity, INewUser {}

@Injectable()
export class UserRepository extends Repository<IProfile>
{
   public findByLogin(login: string): Promise<IUser | null> {
      const user = this.store.find((u) => u.login === login);
      return Promise.resolve(user || null);
   }
}