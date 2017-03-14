import { Document } from 'mongoose';
import { BaseRepository } from './interfaces/base-repository';
import { Usuario, UsuarioModel } from '../models/interfaces';
import { Usuarios } from '../models/schemas';

export class UsuarioRepository implements BaseRepository<Usuario> {
   private model: UsuarioModel;

   constructor() { this.model = Usuarios }

   create(item: Usuario, callback: (error: any, result: any) => void) {
      this.model.create(item, callback);
   }
   getAll(callback: (error: any, result: Usuario) => void) {
      this.model.find({}, callback);
   }
   update(item: Usuario, data: Usuario, callback: (error: any, result: any) => void) {
      item.update(data, callback);
   }
   delete(item: Usuario, callback: (error: any, result: any) => void) {
      item.remove((err) => callback(err, { _id: item._id }));
   }
   findById(_id: string, callback: (error: any, result: Usuario) => void) {
      this.model.findById(_id, callback);
   }
   findEmail(item: Usuario, callback: (error: any, result: Usuario) => void) {
      this.model.findOne({ email: item.email }, callback)
   };
}
