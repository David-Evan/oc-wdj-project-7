import * as Config from './modules/config.js';
import {GoogleMap} from './googleMap.js';
import {EffectManager} from "./modules/effectManager.js";
import {ErrorManager} from "./modules/errorManager.js";

export class AppManager {

    initProperties(config) {

        this.googleMapConfig = config && config.googleMapConfig || Config.GoogleMap;
        this.effectManagerConfig = config && config.effectManagerConfig || Config.EffectManager;

        this.googleMap = null;
        this.effectManager = null;
    }

    constructor(config){
        this.initProperties(config);
    }

    startApp(){
        try {
            this.effectManager = new EffectManager(this.effectManagerConfig);
            this.googleMap = new GoogleMap(this.effectManager, this.googleMapConfig);
        }
        catch (e) {
            new ErrorManager(e, Config.Error);
        }
    }
}