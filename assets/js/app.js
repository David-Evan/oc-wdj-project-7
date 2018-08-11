import * as Config from './modules/config.js';
import {ErrorManager} from "./modules/errorManager.js";
import {GoogleMap} from './googleMap.js';

try{
    new GoogleMap(Config.GoogleMap);
}
catch (e) {
    new ErrorManager(e, Config.Error);
}