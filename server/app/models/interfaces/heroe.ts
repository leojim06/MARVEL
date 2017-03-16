import { Document, Model } from 'mongoose';

import { Usuario } from './usuario';

export interface Heroe extends Document {
   name: string;
   desc: string;
   power: number;
   level: number;
   saved: number;
   img: string;
   listedBy: Usuario;
}

export interface HeroeModel extends Model<Heroe> { }
