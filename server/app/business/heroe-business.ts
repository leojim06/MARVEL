import { BaseBusiness } from './interfaces/base-business';
import { HeroeRepository } from '../repository/heroe-repository';
import { Heroe } from '../models/interfaces';
import { ValidatorError } from '../utils/validator-error';
import { UsuarioBusiness } from './usuario-business';

// export class HeroeBusiness implements BaseBusiness<Heroe> {
export class HeroeBusiness {
   private heroeRepository: HeroeRepository;
   constructor() { this.heroeRepository = new HeroeRepository() }

   create(item: Heroe, reclutador: string, callback: (error: any, result: Heroe) => void) {
      let usuarioBusiness: UsuarioBusiness = new UsuarioBusiness();
      usuarioBusiness.findById(reclutador, (error, result) => {
         // this.findById(reclutador, (error, result) => {
         if (error) {
            callback(error, null);
         } else {
            if (result.role !== 'superheroe') {
               return callback(ValidatorError.forbidden(), null);
            } else {
               item.listedBy = result;
               this.heroeRepository.create(item, (error: any, result: Heroe) => {
                  if (error || !result) {
                     return callback(ValidatorError.constructError(error), null);
                  } else {
                     return callback(null, result);
                  }
               });
            }
         }
      })
   }
   getAll(callback: (error: any, result: Heroe[]) => void) {
      this.heroeRepository.getAll((error, result) => {
         if (error) {
            return callback(ValidatorError.constructError(error), null);
         } else if (!result) {
            return callback(ValidatorError.notFoundGetAllError('Heroes'), null);
         } else {
            return callback(null, result);
         }
      });
   }
   findById(id: string, callback: (error: any, result: Heroe) => void) {
      this.heroeRepository.findById(id, (error: any, result: Heroe) => {
         if (error) {
            return callback(ValidatorError.constructError(error), null);
         } else if (!result) {
            return callback(ValidatorError.notFoundGetByIdError('el heroe'), null);
         } else {
            return callback(null, result);
         }
      });
   }
   update(id: string, data: Heroe, callback: (error: any, result: any) => void) {
      this.findById(id, (error, result) => {
         if (error) {
            return callback(error, null)
         } else {
            this.heroeRepository.update(result, data, (error, result) => {
               if (error) {
                  return callback(ValidatorError.constructError(error), null);
               } else if (result.ok === 0) {
                  return callback(ValidatorError.updateError('Heroe'), null);
               } else {
                  return callback(null, result)
               }
            });
         }
      });
   }

   delete(id: string, callback: (error: any, result: any) => void) {
      this.findById(id, (error, result) => {
         if (error) {
            callback(error, null);
         } else {
            this.heroeRepository.delete(result, (error, result) => {
               if (error) {
                  return callback(ValidatorError.constructError(error), null);
               } else if (!result) {
                  return callback(ValidatorError.deleteError('el Heroe'), null);
               } else {
                  return callback(null, result);
               }
            });
         }
      });
   }
}