import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';

import { Routes } from '../app/routes';

class App {
   public express: express.Application;
   constructor() {
      this.express = express();
      this.setMiddleware();
      this.setRoutes();
   }
   private setRoutes(): void {
      this.express.get('/', this.renderHelloWorld);
      this.express.use(new Routes().routes);
   }
   private renderHelloWorld(req: express.Request, res: express.Response): void {
      res.status(200).send({ message: 'Hello World (^.^)' });
   }
   private setMiddleware(): void {
      // Establece el logger solo si la variable de entorno es de desarrollo
      if (this.express.get('env') === 'development') {
         this.express.use(logger('dev'));
      }
      this.express.use(bodyParser.json());
      this.express.use(bodyParser.urlencoded({ extended: true }));
      this.express.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
         res.header('Access-Control-Allow-Origin', '*');
         res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
         res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
         next();
      });
   }
}
export default new App().express;
