import { Router } from 'express';
import { ProtectedDataController } from '../controllers/protected-data-controller';
import { VerifyAuth } from '../middlewares/verify-auth';

const router: Router = Router();

export class ProtectedDataRoutes {
   private dataController: ProtectedDataController;
   private verify: VerifyAuth;

   constructor() {
      this.dataController = new ProtectedDataController();
      this.verify = new VerifyAuth();
   }

   public get routes(): Router {
      let controller = this.dataController;
      router.get('/usuario', controller.logedInData);
      router.get('/heroe', this.verify.verifyRole('superheroe'), controller.logedInHeroe);
      router.get('/villano', this.verify.verifyRole('supervillano'), controller.logedInVillano);
      return router;
   }
}