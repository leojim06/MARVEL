import { Router } from 'express';
import { HeroeController } from '../controllers/heroe-controller';
import { VerifyAuth } from '../middlewares/verify-auth';

const router: Router = Router();

export class HeroeControllerRoutes {
   private heroeController: HeroeController;
   private verify: VerifyAuth;

   constructor() {
      this.heroeController = new HeroeController();
      this.verify = new VerifyAuth();
   }

   public get routes(): Router {
      let controller = this.heroeController;
      router.get('/', controller.getAll);         // cualquier logeado
      router.post('/', this.verify.verifyRole('superheroe'), controller.create);         // solo superheroe
      router.get('/:id', controller.findById);      // cualquier logeado
      router.put('/:id', this.verify.verifyRole('superheroe'), controller.update);      // solo superheroe
      router.delete('/:id', this.verify.verifyRole('superheroe'), controller.delete);   // solo superheroe
      return router;
   }
}