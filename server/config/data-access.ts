import { Connection, connection, connect } from 'mongoose';
import { Config } from './config';

export class DataAccess {
   static mongooseInstance: any;
   static mongooseConnection: Connection;

   constructor() {
   }

   static connect(): Connection {
      if (this.mongooseInstance) {
         return this.mongooseInstance;
      }

      this.mongooseConnection = connection;
      this.mongooseConnection.once('open', () => { });

      process.env.NODE_ENV === 'test' ?
         this.mongooseInstance = connect(Config.DB_TEST) :
         this.mongooseInstance = connect(Config.DB);

      return this.mongooseInstance;
   }
}

DataAccess.connect();