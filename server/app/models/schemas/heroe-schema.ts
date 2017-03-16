import { Schema } from 'mongoose';

import { Usuarios, UsuarioSchema } from '../schemas/usuario-schema';
import { Usuario, UsuarioModel } from '../interfaces/usuario';
import { HeroeModel } from '../interfaces/heroe';
import { DataAccess } from '../../../config/data-access';

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

const HeroeSchema: Schema = new mongoose.Schema({
   name: { type: String, required: [true, 'El nombre del heroe es requerido'], trim: true },
   desc: { type: String },
   power: { type: Number, min: 500, max: 999999, default: 500 },
   level: { type: Number, min: 1, max: 5, default: 1 },
   saved: { type: Number },
   img: { data: Buffer, contentType: String },
   // listedBy: [UsuarioSchema]
   listedBy: { type: Schema.Types.Mixed, required: [true, 'El Heroe debe ser reclutado para entrar en la liga'] }
}, { timestamps: true });

export const Heroes = <HeroeModel>mongooseConnection.model('Heroes', HeroeSchema);