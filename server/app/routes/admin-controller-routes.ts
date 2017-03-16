import { Router } from 'express';
import { AdminController } from '../controllers/admin-controller';
import { VerifyAuth } from '../middlewares/verify-auth';

const router: Router = Router();

export class AdminControllerRoutes {
   private adminController: AdminController;
   private verify: VerifyAuth;

   constructor() {
      this.adminController = new AdminController();
      this.verify = new VerifyAuth();
   }

   public get routes(): Router {
      let controller = this.adminController;
      router.get('/usuarios', controller.getAll);
      router.get('/usuarios/:id', controller.getById);
      router.put('/usuarios/:id', controller.changeRole);
      return router;
   }
}