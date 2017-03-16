import { Request, Response, NextFunction } from 'express';
import { Usuarios } from '../models/schemas';
import { JwtAuth } from '../../config/jwt-auth';
import { ValidatorError } from '../utils/validator-error';

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
                  let error = ValidatorError.unauthorizen();
                  return res.status(error.status).send(error.body);
               }
               // Verificar información de token
               Usuarios.findById(decoded._id, (err, user) => {
                  if (err) {
                     let error = ValidatorError.constructError(err);
                     return res.status(error.status).send(error.body);
                  }
                  if (!user) {
                     let error = ValidatorError.tokenUserNotFound();
                     return res.status(error.status).send(error.body);
                  }
                  if (user.role !== role) {
                     let error = ValidatorError.forbidden();
                     return res.status(error.status).send(error.body);
                  } else {
                     next()
                  }
               });
            } catch (error) {
               return res.status(500).send({ SERVER_ERROR: error.message });
            }
         } else {
            let error = ValidatorError.unauthorizen();
            return res.status(error.status).send(error.body);
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
                  let error = ValidatorError.unauthorizen();
                  return res.status(error.status).send(error.body);
               }
               // Verificar información de token
               Usuarios.findById(decoded._id, (err, user) => {
                  if (err) {
                     let error = ValidatorError.constructError(err);
                     return res.status(error.status).send(error.body);
                  } else if (!user) {
                     let error = ValidatorError.tokenUserNotFound();
                     return res.status(error.status).send(error.body);
                  }
                  next();
               });
            } catch (error) {
               return res.status(500).send({ SERVER_ERROR: error.message });
            }
         } else {
            let error = ValidatorError.unauthorizen();
            return res.status(error.status).send(error.body);
         }
      }
   }
}
