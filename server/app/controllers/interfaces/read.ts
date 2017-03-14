import { RequestHandler } from 'express';

export interface ReadController {
   getAll: RequestHandler;
   findById: RequestHandler;
}