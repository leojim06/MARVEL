import { Request, Response, NextFunction } from 'express';
import { Usuarios } from '../models/schemas';
import { JwtAuth } from '../../config/jwt-auth';

export class VerifyAuth {
   verifyRole(role: string) {
      return function (req: Request, res: Response, next: NextFunction) {
         let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
         let key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];
         if (token || key) {
            try {
               let decoded = JwtAuth.decodeToken(token);
               // Tiempo de token expiró
               if (decoded.exp <= Date.now()) {
                  return res.status(400).send({ 'ERROR': 'Su sesión terminó', 'MSG': 'Reinicie sesión para continuar' });
               }
               // Verificar información de token
               Usuarios.findById(decoded._id, (err, user) => {
                  if (err) {
                     return res.status(401).send({ 'ERROR': err, 'MSG': 'Se retiraron los privilegios del usuario' });
                  }
                  if (!user) {
                     return res.status(404).send({ 'ERROR': 'Usuario no encontrado', 'MSG': 'El usuario fue retirado durante el proceso' });
                  }
                  if (user.role === role) {
                     next()
                  } else {
                     return res.status(403).send({ 'ERROR': true, 'MSG': 'No posee autorización para ingresar a esta sección' });
                  }
               });
            } catch (error) {
               return res.status(500).send({ 'ERROR': error });
            }
         } else {
            return res.status(422).send({ ERROR: 'Error en su solicitud', MSG: 'Inicie sesión para acceder' });
         }
      }
   }

   verifyLogin() {
      return function (req: Request, res: Response, next: NextFunction) {
         let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
         let key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];
         if (token || key) {
            try {
               let decoded = JwtAuth.decodeToken(token);
               // Tiempo de token expiró
               if (decoded.exp <= Date.now()) {
                  return res.status(400).send({ 'ERROR': true, 'MSG': 'El token expiró' });
               }
               // Verificar información de token
               Usuarios.findById(decoded._id, (err, user) => {
                  if (err) {
                     return res.status(500).send({ 'ERROR': 'Error con el servidor', 'MSG': 'Su petición no pudo ser procesada' });
                  }
                  if (!user) {
                     return res.status(404).send({ 'ERROR': 'Usuario no encontrado', 'MSG': 'El usuario fue retirado durante el proceso' });
                  }
                  next();
               });
            } catch (error) {
               return res.status(500).send({ 'ERROR': error });
            }
         } else {
            return res.status(422).send({ ERROR: 'Error en su solicitud', MSG: 'Inicie sesión para acceder' });
         }
      }
   }
}
