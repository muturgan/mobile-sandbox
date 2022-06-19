import { Injectable } from '@nestjs/common';
import jwt = require('jsonwebtoken');
import { IUser, IJwtPayload } from '../dal';
import { config } from '../config';

const jwtOptions: Readonly<jwt.SignOptions> = Object.freeze({
   algorithm: 'RS256',
   expiresIn: 60 * 5, // 60 seconds * 5 minutes
});

@Injectable()
export class JwtService {

   public generateToken(user: IUser): Promise<string> {
      return new Promise<string>((resolve, reject) => {
         const payload: IJwtPayload = { userNume: user.login };

         jwt.sign(payload, config.PRIVATE_KEY, jwtOptions, (err, token) => {
            if (err !== null) {
               return reject(err);
            }

            resolve(token as string);
         });
      });
   }

   public verufyToken(token: string): Promise<IJwtPayload> {
      return new Promise<IJwtPayload>((resolve, reject) => {
         jwt.verify(token, config.PUBLIC_KEY, (err, decoded) => {
            if (err !== null) {
               return reject(err);
            }

            resolve(decoded as any as IJwtPayload);
         });
      });
   }
}
