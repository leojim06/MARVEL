/**
 * Clase de validación de errores para el backend, retorna un objeto
 * para ser mostrado en el frontend
 * 
 * @export
 * @class ValidatorError
 */
export class ValidatorError {

   /**
    * Toma los errores de la capa repository y extrae los mensajes de validación
    * de la schema. Debuelve el error con status y un body para enviar como 
    * response de la capa controller
    * 
    * @static
    * @param {*} error 
    * @returns {{ status: number, body: { ERROR: string, MSG: string } }} 
    * 
    * @memberOf ValidatorError
    */
   public static constructError(error: any): { status: number, body: { ERROR: string, MSG: string } } {
      if (error.name === 'ValidationError') {
         let errorBody: string = '';
         for (let key in error.errors) {
            if (error.errors[key].message) {
               errorBody += error.errors[key].message + "\n";
            }
         }
         return {
            status: 400,
            body: { ERROR: 'Error en su solicitud', MSG: errorBody }
         }
      } else if (error.name === 'CastError') {
         return {
            status: 400,
            body: { ERROR: 'Error en su solicitud', MSG: 'Su petición es inválida' }
         }
      } else {
         return {
            status: 500,
            body: { ERROR: 'Problemas con la base de datos', MSG: 'No se puedo completar la solicitud' }
         }
      }
   }

   /**
    * Recibe el nombre de la entidad de la cual se estan recuperando todos los registros
    * Ejemplo: Heroes -> No existen resitros en `Heroes`
    * 
    * @static
    * @param {string} entidad 
    * @returns {{ status: number, body: { ERROR: string, MSG: string } }} 
    * 
    * @memberOf ValidatorError
    */
   public static notFoundGetAllError(entidad: string): { status: number, body: { ERROR: string, MSG: string } } {
      return {
         status: 404,
         body: { ERROR: 'No encontrado', MSG: `No existen registros en ${entidad}` }
      }
   }

   /**
    * Recibe el nombre del objeto del cual se esta recuperando su información
    * Ejemplo: el Heroe -> No existe información para `el heroe`
    * 
    * @static
    * @param {string} entidad 
    * @returns {{ status: number, body: { ERROR: string, MSG: string } }} 
    * 
    * @memberOf ValidatorError
    */
   public static notFoundGetByIdError(entidad: string): { status: number, body: { ERROR: string, MSG: string } } {
      return {
         status: 404,
         body: { ERROR: 'No encontrado', MSG: `No existe información para ${entidad}` }
      }
   }

   /**
    * Recibe el nombre del objeto del cual se está actualizando la información
    * Ejemplo: Heroe -> No se pudo actualizar la información del `Heroe`
    * 
    * @static
    * @param {string} entidad 
    * @returns {{ status: number, body: { ERROR: string, MSG: string } }} 
    * 
    * @memberOf ValidatorError
    */
   public static updateError(entidad: string): { status: number, body: { ERROR: string, MSG: string } } {
      return {
         status: 400,
         body: { ERROR: 'Problemas en la actualización', MSG: `No hay datos para actualizar la información del ${entidad}` }
      }
   }


   /**
    * Recibe el nombre del objeto que se quiere eliminar
    * Ejemplo: el Heroe -> No se pudo eliminar `el hereo`
    * 
    * @static
    * @param {string} entidad 
    * @returns {{ status: number, body: { ERROR: string, MSG: string } }} 
    * 
    * @memberOf ValidatorError
    */
   public static deleteError(entidad: string): { status: number, body: { ERROR: string, MSG: string } } {
      return {
         status: 400,
         body: { ERROR: 'Problemas en la eliminación', MSG: `No se pudo eliminar ${entidad}` }
      }
   }

   /**
    * Verifica si la lista de parametros está presente
    * 
    * @static
    * @param {any} params 
    * @returns {boolean} : false si algun parametro no existe
    * 
    * @memberOf ValidatorError
    */
   public static isPresent(...params): boolean {
      let isPresent: boolean = true;
      params.forEach(param => {
         if (!param) {
            isPresent = false;
         }
      });
      return isPresent;
   }

   /**
    * Recibe los campos que son obligatorios
    * Ejemplo: usuario, contraseña -> Los campos `usuario contraseña` son obligatorios
    * 
    * @static
    * @param {any} campos 
    * @returns {{ status: number, body: { ERROR: string, MSG: string } }} 
    * 
    * @memberOf ValidatorError
    */
   public static fieldNotFound(...campos): { status: number, body: { ERROR: string, MSG: string } } {
      let listaCampos: string = '[ ';
      campos.forEach(campo => {
         listaCampos += campo + ' ';
      });
      listaCampos += ']';
      return {
         status: 422,
         body: { ERROR: 'Faltan campos', MSG: `Los campos ${listaCampos} son obligatorios` }
      }
   }

   /**
    * Verifica la razón por la que falló el login con ayuda del parametro reason
    * 
    * @static
    * @param {number} reason 
    * @returns {{ status: number, body: { ERROR: string, MSG: string } }} 
    * 
    * @memberOf ValidatorError
    */
   public static loginError(reason: number): { status: number, body: { ERROR: string, MSG: string } } {
      switch (reason) {
         case 0: //NOT_FOUND
            return {
               status: 404,
               body: { ERROR: 'Error en su solicitud', MSG: 'Usuario no encontrado' }
            };
         case 1: //PASSWORD_INCORRECT
            return {
               status: 400,
               body: { ERROR: 'Error en su solicitud', MSG: 'Contraseña incorrecta' }
            }
         case 2: //MAX_ATTEMPTS
            return {
               status: 423,
               body: {
                  ERROR: 'Cuenta bloqueada',
                  MSG: 'Se ha bloquedo la cuenta por maximo de intentos permitidos.  Intente ingresar más tarde'
               }
            }
         default: //SERVER_ERROR
            return {
               status: 500,
               body: {
                  ERROR: 'Problemas con el servidor',
                  MSG: 'No se puede completar la acción por problemas con el servidor'
               }
            }
      }
   }

   /**
    * No autorizado - No logeado - La sesión terminó.
    * No ha iniciado sesión o
    * El token ya no es valido porque el tiempo de uso sobrepasó el liminte
    * 
    * @static
    * @returns {{ status: number, body: { ERROR: string, MSG: string } }} 
    * 
    * @memberOf ValidatorError
    */
   public static unauthorizen(): { status: number, body: { ERROR: string, MSG: string } } {
      return {
         status: 401,
         body: { ERROR: 'No autorizado', MSG: 'Inicie sesión para continuar' }
      }
   }

   /**
    * Restringido
    * El recurso es restringido y es accesible unicamente con los permisos requeridos de rol
    * 
    * @static
    * @returns {{ status: number, body: { ERROR: string, MSG: string } }} 
    * 
    * @memberOf ValidatorError
    */
   public static forbidden(): { status: number, body: { ERROR: string, MSG: string } } {
      return {
         status: 403,
         body: { ERROR: 'Zona restringida', MSG: 'No posee autorización para ingresar a esta sección' }
      }
   }

   // ===========  Casos especiales
   // ===== Token valido pero usuario no encontrado

   /**
    * Token valido pero usuario no encontrado. El usuario fue eliminado
    * mientras este tenía un token valido
    * 
    * @static
    * @returns {{ status: number, body: { ERROR: string, MSG: string } }} 
    * 
    * @memberOf ValidatorError
    */
   public static tokenUserNotFound(): { status: number, body: { ERROR: string, MSG: string } } {
      return {
         status: 410,
         body: { ERROR: 'Usurio no encontrado', MSG: 'El usuario fue eliminado durante el proceso' }
      }
   }
}