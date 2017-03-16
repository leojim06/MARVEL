import * as express from 'express';
import { AuthControllerRoutes } from './auth-controller-routes';
import { ProtectedDataRoutes } from './protected-data-routes';
import { AdminControllerRoutes } from './admin-controller-routes';
import { HeroeControllerRoutes } from './heroe-controller-routes';
import { VerifyAuth } from '../middlewares/verify-auth';

const app = express();
const prefix: string = '/api/v1';

export class Routes {
   private verify: VerifyAuth;

   constructor() {
      this.verify = new VerifyAuth();
   }
   public get routes(): express.Application {
      app.use('/', new AuthControllerRoutes().routes);
      app.use(`${prefix}/heroes`, this.verify.verifyLogin(), new HeroeControllerRoutes().routes);
      app.use(`${prefix}/admin`, this.verify.verifyRole('superusuario'), new AdminControllerRoutes().routes);
      app.use(`${prefix}/data`, this.verify.verifyLogin(), new ProtectedDataRoutes().routes);
      return app;
   }
}
