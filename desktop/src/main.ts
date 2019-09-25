import { config as configDev } from './config/config.dev';
import { config as configProd } from './config/config.prod';


import { Application } from './application';
import { isDevMode } from './utils';


try {

    Application.startWithConfig(isDevMode ? configDev : configProd);

} catch (e) {

    console.log('Application starting failed', e);

}


