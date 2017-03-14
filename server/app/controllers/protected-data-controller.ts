import { Request, Response } from 'express';

export class ProtectedDataController {

   logedInData(req: Request, res: Response): void {
      try {
         res.status(200).send({
            MSG: 'Información para usuarios registrados',
            data: publicLoginData
         })
      } catch (error) {
         res.status(500).send({ SERVER_ERROR: error });
      }
   }

   logedInHeroe(req: Request, res: Response): void {
      try {
         res.status(200).send({
            MSG: 'Información para heroes',
            data: heroeData
         })
      } catch (error) {
         res.status(500).send({ SERVER_ERROR: error });
      }
   }

   logedInVillano(req: Request, res: Response): void {
      try {
         res.status(200).send({
            MSG: 'Información para villanos',
            data: villanoData
         })
      } catch (error) {
         res.status(500).send({ SERVER_ERROR: error });
      }
   }


}

interface data {
   title: string,
   body: string,
   status: boolean
}


const publicLoginData: data[] = [
   { title: 'Login 1', body: 'datos privados de login', status: true },
   { title: 'Login 2', body: 'datos privados de login', status: true }
]

const heroeData: data[] = [
   { title: 'Heroe 1', body: 'Información privada del Heroe ', status: true }
]

const villanoData: data[] = [
   { title: 'Villano 1', body: 'Información privada del Villano ', status: true }
]