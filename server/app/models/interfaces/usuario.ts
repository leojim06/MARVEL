import { Document, Model } from 'mongoose';

export interface Usuario extends Document {
   username: string;
   password: string;
   email: string;
   role: string;
   activated: boolean;
   loginAttempts: number;
   lockUntil: number;

   comparePassword(candidatePassword: string, callback: (err: any, isMatch: boolean) => void);
   isLocked(): boolean;
   incLoginAttempts(callback: (err: any) => void);
}

export interface UsuarioModel extends Model<Usuario> {
   getAuthenticated(
      username: string,
      password: string,
      callback: (err: any, result: Usuario, reason: number) => void);
   failedLogin({ }): number;
}
