import * as express from 'express'
class App {
   public express: express.Application;
   constructor() {
      this.express = express();
      this.setRoutes();
   }
   private setRoutes(): void {
      this.express.get('/', this.renderHelloWorld);
   }
   private renderHelloWorld(req: express.Request, res: express.Response): void {
      res.status(200).send({ message: 'Hello World (^.^)' });
   }
}
export default new App().express;
