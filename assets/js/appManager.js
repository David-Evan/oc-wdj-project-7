import * as Config from './modules/config.js';
import {GoogleMap} from './googleMap.js';
import {EffectManager} from './effectManager.js';
import {ErrorManager} from './modules/errorManager.js';
import {Slideshow} from './modules/slideshow.js';

export class AppManager {

    initProperties(config) {

        this.googleMapConfig = config && config.googleMapConfig || Config.GoogleMap;
        this.effectManagerConfig = config && config.effectManagerConfig || Config.EffectManager;

        this.slideshow = null;
        this.googleMap = null;
        this.effectManager = null;
    }

    constructor(config){
        this.initProperties(config);
    }

    startApp(){
        try {

            this.slideshow = new Slideshow('slideshowSection', Config.Slideshow);
            this.effectManager = new EffectManager(this.effectManagerConfig);
            this.googleMap = new GoogleMap(this.effectManager, this.googleMapConfig);
        }
        catch (e) {
            new ErrorManager(e, Config.Error);
        }
    }
}