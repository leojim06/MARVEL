import { Usuarios } from '../models/schemas';
import { UsuarioRepository } from '../repository';
import { BaseBusiness } from './interfaces/base-business';
import { Usuario } from '../models/interfaces'
import { ValidatorError } from '../utils/validator-error';

export class UsuarioBusiness implements BaseBusiness<Usuario> {
   private userRepository: UsuarioRepository;

   constructor() { this.userRepository = new UsuarioRepository() }

   login(username: string, password: string, callback: (error: any, result: Usuario) => void) {
      if (!ValidatorError.isPresent(username, password)) {
         return callback(ValidatorError.fieldNotFound('usuario', 'contraseña'), null);
      } else {
         Usuarios.getAuthenticated(username, password, (error: any, result: Usuario, reason: number) => {
            if (error) {
               return callback(ValidatorError.constructError, null);
            }
            if (!result || reason !== null) {
               return callback(ValidatorError.loginError(reason), null);
            }
            return callback(null, result);
         });
      }
   }

   create(item: Usuario, callback: (error: any, result: Usuario) => void) {
      this.userRepository.create(item, (error: any, result: Usuario) => {
         if (error || !result) {
            return callback(ValidatorError.constructError(error), null);
         } else {
            return callback(null, result);
         }
      });
   }

   getAll(callback: (error: any, result: Usuario[]) => void) {
      this.userRepository.getAll((error, result) => {
         if (error) {
            return callback(ValidatorError.constructError(error), null);
         } else if (!result) {
            return callback(ValidatorError.notFoundGetAllError('Usuarios'), null);
         } else {
            return callback(null, result);
         }
      });
   }

   findById(id: string, callback: (error: any, result: Usuario) => void) {
      this.userRepository.findById(id, (error, result) => {
         if (error) {
            return callback(ValidatorError.constructError(error), null);
         } else if (!result) {
            return callback(ValidatorError.notFoundGetByIdError('el usuario'), null);
         } else {
            return callback(null, result);
         }
      });
   }

   update() { }
   delete() { }

   changeRole(id: string, role: string, callback: (error: any, result: any) => void) {
      if (!ValidatorError.isPresent(role)) {
         return callback(ValidatorError.fieldNotFound('rol'), null);
      } else if (role === 'superheroe' || role === 'supervillano' || role === 'user') {
         this.userRepository.findById(id, (error, result) => {
            if (error) {
               return callback(ValidatorError.constructError(error), null);
            } else if (!result) {
               return callback(ValidatorError.notFoundGetByIdError('el usuario'), null);
            } else {
               this.userRepository.changeRole(result, role, (error, result) => {
                  if (error) {
                     return callback(ValidatorError.constructError(error), null);
                  } else if (result.ok === 0) {
                     return callback(ValidatorError.updateError('Usuario'), null);
                  } else {
                     return callback(null, result);
                  }
               })
            }
         });
      } else {
         callback({
            status: 400,
            body: {
               ERROR: 'Error en su solicitud',
               MSG: 'El rol debe ser user || superheroe || supervillano || superusuario'
            }
         }, null)
      }
   }
}