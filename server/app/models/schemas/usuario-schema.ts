// import * as bcrypt from 'bcryptjs';
import { compare, hash, genSalt } from 'bcryptjs';
import { DataAccess } from '../../../config/data-access';
import { Usuario, UsuarioModel } from '../interfaces'

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

const SALT_WORK_FACTORY = 10;
const MAX_LOGIN_ATTEMPTS: number = 5;
const LOCK_TIME: number = 1 * 60 * 60 * 1000 // 1 hora

export const UsuarioSchema = new mongoose.Schema({
   username: {
      type: String,
      required: [true, 'El usuario es requerido'],
      unique: true,
      trim: true
   },
   password: { type: String, required: [true, 'La contraseña es requerida'], trim: true },
   email: {
      type: String,
      required: [true, 'La dirección de correo es requerida'],
      unique: true,
      trim: true
   },
   activated: { type: Boolean, default: false },
   role: { type: String, enum: ['SuperAdmin', 'SuperHeroe', 'SuperVillano', 'user'], default: 'user' },

   loginAttempts: { type: Number, required: true, default: 0 },
   lockUntil: { type: Number }
}, { timestamps: true });

UsuarioSchema.path('username').validate(function (value, respond) {
   Usuarios.findOne({ username: value }, function (error, usuario) {
      usuario ? respond(false) : respond(true);
   });
}, 'El nombre de usuario ya está registrado');

UsuarioSchema.path('email').validate(function (value, respond) {
   Usuarios.findOne({ email: value }, function (error, usuario) {
      usuario ? respond(false) : respond(true);
   });
}, 'El correo electrónico ya está registrado');

UsuarioSchema.pre('save', function (next) {
   let user = this;
   // pregunta si password NO esta siendo modificada para terminar
   if (!user.isModified("password")) {
      return next();
   }
   // si password es nuevo o modificado lo encripta
   genSalt(SALT_WORK_FACTORY, (err, salt) => {
      err ? next(err) : hash(user.password.trim(), salt, function (err, hash) {
         err ? next(err) : user.password = hash;
         next();
      });
   });
});

UsuarioSchema.virtual('isLocked').get(function () {
   return !!(this.lockUntil && this.lockUntil > Date.now());
});

UsuarioSchema.methods.comparePassword = function (candidatePassword: string, callback: (err: any, result: boolean) => void) {
   compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) {
         return callback(err, false);
      }
      callback(null, isMatch);
   });
};

UsuarioSchema.methods.incLoginAttempts = function (callback) {
   // si existe un bloqueo anterior y este ya ha expirado
   // eliminarlo y reiniciar el intento de login a 1
   if (this.lockUntil && this.lockUntil < Date.now()) {
      return this.update({
         $set: { loginAttempts: 1 },
         $unset: { lockUntil: 1 }
      }, callback);
   }
   // se incrementan los intentos de login
   let updates = { $inc: { loginAttempts: 1 } };
   // bloquear la cuenta si se excede el máximo permitido
   // de intentos y la cuenta aun no esta bloqueada
   if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
      updates['$set'] = { lockUntil: Date.now() + LOCK_TIME };
   }
   return this.update(updates, callback);
};

const reasons = UsuarioSchema.statics.failedLogin = {
   NOT_FOUND: 0,
   PASSWORD_INCORRECT: 1,
   MAX_ATTEMPTS: 2,
   SERVER_ERROR: 3
};

UsuarioSchema.statics.getAuthenticated = function getAuthenticated(username: string, password: string, callback: (err: any, result: Usuario, reason: number) => void) {
   Usuarios.findOne({ username: username }, (err, user) => {
      // verificar error
      if (err) {
         return callback(err, null, reasons.SERVER_ERROR);
      }
      // verificar que el usuario existe
      if (!user) {
         return callback(null, null, reasons.NOT_FOUND);
      }
      // verificar si la cuenta está bloqueada
      if (user.isLocked) {
         return user.incLoginAttempts((err) => {
            err ?
               callback(err, null, reasons.SERVER_ERROR) :
               callback(null, null, reasons.MAX_ATTEMPTS);
         });
      }
      // comprobar si password coincide
      user.comparePassword(password, (err, isMatch) => {
         if (err) {
            return callback(err, null, reasons.PASSWORD_INCORRECT);
         }
         if (!isMatch) {
            user.incLoginAttempts((err) => {
               err ?
                  callback(err, null, reasons.SERVER_ERROR) :
                  callback(null, null, reasons.PASSWORD_INCORRECT);
            });
         }
         if (isMatch) {
            // si no exiten bloqueos de la cuenta o intentos fallidos
            if (!user.loginAttempts && !user.lockUntil) {
               return callback(null, user, null);
            }
            let updates = {
               $set: { loginAttempts: 0 },
               $unset: { lockUntil: 1 }
            }
            return user.update(updates, (err) => {
               err ?
                  callback(err, null, reasons.SERVER_ERROR) :
                  callback(null, user, null);
            });
         }
      });
   });
};

export const Usuarios = <UsuarioModel>mongooseConnection.model('Usuarios', UsuarioSchema);
