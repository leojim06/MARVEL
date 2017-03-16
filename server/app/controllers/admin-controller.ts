import { Request, Response } from 'express';
import { UsuarioBusiness } from '../business';
import { Usuario } from "../models/interfaces/index";

export class AdminController {
   getAll(req: Request, res: Response): void {
      try {
         let usuarioBusiness = new UsuarioBusiness();
         usuarioBusiness.getAll((error: any, result: Usuario[]) => {
            error ?
               res.status(error.status).send(error.body) :
               res.status(200).send({ usuarios: result });
         });
      } catch (error) {
         res.status(500).send({ SERVER_ERROR: error.message });
      }
   }

   getById(req: Request, res: Response): void {
      try {
         let id = req.params.id || '';
         let usuarioBusiness = new UsuarioBusiness();
         usuarioBusiness.findById(id, (error, result: Usuario) => {
            error ?
               res.status(error.status).send(error.body) :
               res.status(200).send({ usuario: result });
         });
      } catch (error) {
         res.status(500).send({ SERVER_ERROR: error.message });
      }
   }

   changeRole(req: Request, res: Response): void {
      try {
         let id = req.params.id || '';
         let newRole = req.body.role || '';
         let usuarioBusines = new UsuarioBusiness();
         usuarioBusines.changeRole(id, newRole, (error, result) => {
            error ?
               res.status(error.status).send(error.body) :
               res.status(200).send({ result: result })
         });
      } catch (error) {
         res.status(500).send({ SERVER_ERROR: error.message });
      }
   }
}