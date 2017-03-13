import { Config } from './config/config';
import App from './config/express';
App.listen(Config.PORT, (err) => {
   err ?
      console.error(`Server error: ${err}`) :
      console.log(`Server listening on port ${Config.PORT}`);
})
