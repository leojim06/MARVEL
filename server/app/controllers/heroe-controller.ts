import { Request, Response } from 'express';
import { HeroeBusiness } from '../business/heroe-business';
import { BaseController } from './interfaces/base-controller';
import { Heroe } from '../models/interfaces';

export class HeroeController implements BaseController<Heroe> {
   create(req: Request, res: Response): void {
      try {
         let heroe: Heroe = <Heroe>req.body.heroe;
         let recutador: string = req.body.id;
         let heroeBusiness = new HeroeBusiness();
         heroeBusiness.create(heroe, recutador, (error: any, result: Heroe) => {
            error ?
               res.status(error.status).send(error.body) :
               res.status(201).send({ heroe: result })
         });
      } catch (error) {
         res.status(500).send({ SERVER_ERROR: error.message });
      }
   }
   getAll(req: Request, res: Response) {
      try {
         let heroeBusiness = new HeroeBusiness();
         heroeBusiness.getAll((error: any, result: Heroe[]) => {
            error ?
               res.status(error.status).send(error.body) :
               res.status(200).send({ heroes: result })
         });
      } catch (error) {
         res.status(500).send({ SERVER_ERROR: error.message });
      }
   }
   findById(req: Request, res: Response) {
      try {
         let id: string = req.params.id || '';
         let heroeBusiness = new HeroeBusiness();
         heroeBusiness.findById(id, (error: any, result: Heroe) => {
            error ?
               res.status(error.status).send(error.body) :
               res.status(200).send({ heroe: result })
         });
      } catch (error) {
         res.status(500).send({ SERVER_ERROR: error.message });
      }
   }
   update(req: Request, res: Response) {
      try {
         let id: string = req.params.id || '';
         let heroe: Heroe = <Heroe>req.body.heroe;
         let heroeBusiness = new HeroeBusiness();
         heroeBusiness.update(id, heroe, (error: any, result: Heroe) => {
            error ?
               res.status(error.status).send(error.body) :
               // result de update devuelve { ok: 1, nModified: 1, n:1 }
               res.status(201).send('Heroe actualizado')
         });
      } catch (error) {
         res.status(500).send({ SERVER_ERROR: error.message });
      }
   }
   delete(req: Request, res: Response) {
      try {
         let id: string = req.params.id || '';
         let heroeBusiness = new HeroeBusiness();
         heroeBusiness.delete(id, (error: any, result: Heroe) => {
            error ?
               res.status(error.status).send(error.body) :
               // result de delete devuelve { ok:1, n:1 }
               res.status(200).send('Heroe eliminado')
         });
      } catch (error) {
         res.status(500).send({ SERVER_ERROR: error.message });
      }
   }
}