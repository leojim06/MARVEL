import { Request, Response } from 'express';
import { Usuario } from '../models/interfaces';
import { UsuarioBusiness } from '../business';
import { JwtAuth } from '../../config/jwt-auth';

export class AuthController {

   logIn(req: Request, res: Response) {
      try {
         let username: string = req.body.username || '';
         let password: string = req.body.password || '';
         let usuarioBusiness = new UsuarioBusiness();
         usuarioBusiness.login(username, password, (error, result) => {
            error ?
               res.status(error.status).send(error.body) :
               res.status(200).send({
                  token: JwtAuth.genToken(JwtAuth.setUser(result)),
                  user: JwtAuth.setUser(result)
               })
         })
      } catch (error) {
         res.status(500).send({ 'SERVER_ERROR': error.message });
      }
   }

   signUp(req: Request, res: Response): void {
      try {
         let newUser: Usuario = <Usuario>req.body.usuario;
         let usuarioBusiness = new UsuarioBusiness();
         usuarioBusiness.create(newUser, (error, result) => {
            error ?
               res.status(error.status).send(error.body) :
               res.status(201).send({
                  token: JwtAuth.genToken(JwtAuth.setUser(result)),
                  user: JwtAuth.setUser(result)
               });
         })
      } catch (error) {
         res.status(500).send({ 'SERVER_ERROR': error.message });
      }
   }
}
