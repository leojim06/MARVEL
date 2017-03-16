import { BaseRepository } from './interfaces/base-repository';
import { Heroe, HeroeModel } from '../models/interfaces';
import { Heroes } from '../models/schemas';

export class HeroeRepository implements BaseRepository<Heroe> {
   private model: HeroeModel;

   constructor() { this.model = Heroes }

   create(item: Heroe, callback: (error: any, result: Heroe) => void) {
      this.model.create(item, callback);
   }
   getAll(callback: (error: any, result: Heroe[]) => void) {
      this.model.find({}, callback);
   }
   update(item: Heroe, data: Heroe, callback: (error: any, result: any) => void) {
      item.update(data, callback);
   }
   delete(item: Heroe, callback: (error: any, result: any) => void) {
      item.remove(callback);
   }
   findById(id: string, callback: (error: any, result: Heroe) => void) {
      this.model.findById(id, callback);
   }

}