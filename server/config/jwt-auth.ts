import { sign, decode, verify } from 'jsonwebtoken';
import { Config } from './config';
import { Usuario } from '../app/models/interfaces'

export class JwtAuth {
   public static genToken(user) {
      return sign(user, Config.SECRET, {
         expiresIn: this.expiresIn()
      });
   }

   public static expiresIn(): number {
      let expiresDate = new Date();
      return expiresDate.setDate(expiresDate.getHours() + Config.TOKEN_EXPIRES_TIME);
   }

   public static setUser(user: Usuario) {
      return {
         _id: user._id,
         username: user.username,
         email: user.email,
         role: user.role
      };
   }

   public static decodeToken(token) {
      return verify(token, Config.SECRET);
   }
}