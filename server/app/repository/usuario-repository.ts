import { BaseRepository } from './interfaces/base-repository';
import { Usuario, UsuarioModel } from '../models/interfaces';
import { Usuarios } from '../models/schemas';

export class UsuarioRepository implements BaseRepository<Usuario> {
   private model: UsuarioModel;

   constructor() { this.model = Usuarios }

   create(item: Usuario, callback: (error: any, result: any) => void) {
      this.model.create(item, callback);
   }
   getAll(callback: (error: any, result: Usuario[]) => void) {
      this.model.find({}, '_id username email role activated updatedAt createdAt loginAttempts lockUntil', callback);
   }
   update(item: Usuario, data: Usuario, callback: (error: any, result: any) => void) {
      item.update(data, callback);
   }
   delete(item: Usuario, callback: (error: any, result: any) => void) {
      item.remove((err) => callback(err, { id: item._id }));
   }
   findById(id: string, callback: (error: any, result: Usuario) => void) {
      this.model.findById(id, '_id username email role activated updatedAt createdAt loginAttempts lockUntil', callback);
   }
   findEmail(item: Usuario, callback: (error: any, result: Usuario) => void) {
      this.model.findOne({ email: item.email }, 'email', callback)
   };
   changeRole(item: Usuario, role: string, callback: (error: any, result: any) => void) {
      item.update({ "role": role }, callback);
   }
   findUsername(item: Usuario, callback: (error: any, result: Usuario) => void) {
      this.model.findOne({ username: item.username }, 'username', callback);
   }
}
