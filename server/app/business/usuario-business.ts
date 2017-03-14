import { Usuarios } from '../models/schemas';
import { UsuarioRepository } from '../repository';
import { BaseBusiness } from './interfaces/base-business';
import { Usuario } from '../models/interfaces'

export class UsuarioBusiness implements BaseBusiness<Usuario> {
   private userRepository: UsuarioRepository;

   constructor() { this.userRepository = new UsuarioRepository() }

   login(username: string, password: string, callback: (error: any, result: Usuario) => void) {
      if (!username || !password) {
         return callback({
            status: 422,
            body: {
               ERROR: 'Faltan campos',
               MSG: 'Los campos usuario y contraseña son obligatorios'
            }
         }, null);
      }
      Usuarios.getAuthenticated(username, password, (error: any, result: Usuario, reason: number) => {
         if (error) {
            return callback({
               status: 500,
               body: {
                  ERROR: 'Problemas encontrando usuario',
                  MSG: 'No se pudo completar la acción'
               }
            }, null);
         }
         if (!result || reason !== null) {
            switch (reason) {
               case 0: //NOT_FOUND
                  return callback({
                     status: 404,
                     body: {
                        ERROR: 'Error en su solicitud',
                        MSG: 'Usuario no encontrado'
                     }
                  }, null);
               // break;
               case 1: //PASSWORD_INCORRECT
                  return callback({
                     status: 400,
                     body: {
                        ERROR: 'Error en su solicitud',
                        MSG: 'Contraseña incorrecta'
                     }
                  }, null);
               // break;
               case 2: //MAX_ATTEMPTS
                  return callback({
                     status: 423,
                     body: {
                        ERROR: 'Cuenta bloqueada',
                        MSG: 'Se ha bloquedo la cuenta por maximo de intentos permitidos.  Intente ingresar más tarde'
                     }
                  }, null)
               // break;
               default: //SERVER_ERROR
                  return callback({
                     status: 500,
                     body: {
                        ERROR: 'Problemas con el servidor',
                        MSG: 'No se puede completar la acción por problemas con el servidor'
                     }
                  }, null)
               // break;
            }
         }
         return callback(null, result);
      });
   };

   create(item: Usuario, callback: (error: any, result: Usuario) => void) {
      if (!item.username || !item.password || !item.email) {
         return callback({
            status: 422,
            body: {
               ERROR: 'Faltan campos',
               MSG: 'Los campos usuario, contraseña, email son obligatorios'
            }
         }, null);
      }
      this.userRepository.findEmail(item, (err: any, res: Usuario) => {
         if (res !== null) {
            return callback({
               status: 400,
               body: {
                  ERROR: 'Error en su solicitud',
                  MSG: 'El email ya fue registrado'
               }
            }, null);
         }
         this.userRepository.create(item, (error: any, result: Usuario) => {
            if (error) {
               return callback({
                  status: 500,
                  body: {
                     ERROR: 'Problemas registrando al usuario',
                     MSG: 'No se puedo completar la acción'
                  }
               }, null)
            }
            return callback(null, result);
         });
      });
   }

   getAll() { }
   update() { }
   delete() { }
   findById() { }

   // getAll(callback: (error: any, result: any) => void) {
   //    this.userRepository.getAll(callback);
   // }
   // update(_id: string, data: Usuario, callback: (error: any, result: any) => void) {
   //    this.userRepository.findById(_id, (err: any, res: Usuario) => {
   //       if (err || !res) {
   //          return callback(err, res);
   //       }
   //       this.userRepository.update(res, data, callback);
   //    });
   // }
   // delete(_id: string, callback: (error: any, result: any) => void) {
   //    this.userRepository.findById(_id, (err: any, res: Usuario) => {
   //       if (err || !res) {
   //          return callback(err, res);
   //       }
   //       this.userRepository.delete(res, callback);
   //    });
   // }
   // findById(_id: string, callback: (error: any, result: Usuario) => void) {
   //    this.userRepository.findById(_id, callback);
   // }


}