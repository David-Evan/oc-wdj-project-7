import * as Config from './modules/config.js';
import {GoogleMap} from './googleMap.js';
import {EffectManager} from './effectManager.js';
import {ErrorManager} from './modules/errorManager.js';
import {Slideshow} from './modules/slideshow.js';

/**
 * This is the app start point.
 */
export class AppManager {

    /**
     * Init object properties - config can be used to change default values.
     * @param config
     */
    initProperties(config) {

        this.googleMapConfig = config && config.googleMapConfig || Config.GoogleMap;
        this.effectManagerConfig = config && config.effectManagerConfig || Config.EffectManager;

        this.slideshow = null;
        this.googleMap = null;
        this.effectManager = null;
    }

    /**
     * Call initProperties()
     * @param config
     */
    constructor(config){
        this.initProperties(config);
    }

    /**
     * Starting app. Create the differents objects to be used by app
     */
    startApp(){
        try {

            this.slideshow = new Slideshow('slideshowSection', Config.Slideshow);
            this.effectManager = new EffectManager(this.effectManagerConfig);
            this.googleMap = new GoogleMap(this.effectManager, this.googleMapConfig);

            this.removeLoadScreen();
        }
        catch (e) {
            new ErrorManager(e, Config.Error);
        }
    }

    removeLoadScreen(){
        let $this = $('#loader');
        $this.fadeOut(1600, ()=>$this.remove());
    }
}