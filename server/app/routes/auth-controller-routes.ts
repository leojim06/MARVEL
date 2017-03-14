import { Router } from 'express';
import { AuthController } from '../controllers/auth-controller';

const router: Router = Router();

export class AuthControllerRoutes {
   private authController: AuthController;

   constructor() {
      this.authController = new AuthController();
   }

   public get routes(): Router {
      let controller = this.authController;
      router.post('/login', controller.logIn);
      router.post('/signup', controller.signUp);
      return router;
   }
}