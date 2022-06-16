import { Injectable } from '@nestjs/common';
import { UserRepository } from './models/user.repository';

export { IUser, IJwtPayload } from './models/user.repository';

@Injectable()
export class Dal {
   public readonly users = new UserRepository();
}