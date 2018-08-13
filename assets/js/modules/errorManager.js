import * as Tools from '../lib/tools.js';

/**
 * Error Manager
 */
export class ErrorManager{

    /**
     * Init object properties - config can be used to change default values.
     * @param error - {Error} Error to manage - Instance of "Error"
     * @param config
     */
    initProperties(error, config){

        this.enabledFullDescription = config && config.enabledFullDescription || false;

        this.error = error;
    }

    /**
     * @param error
     * @param config
     */
    constructor(error, config = false) {
        this.initProperties(error, config);
        this.createHTMLError();
    }

    /**
     * Create the HTML Error component
     */
    createHTMLError(){

        let fullDesc = '';
        if(this.enabledFullDescription)
            fullDesc = '<p>"<i>'+this.error.message+'</i>"</p>';

        const slideNode = Tools.htmlToElements(
            '<div id="error" class="row">'+
               '<div class="errorBox col-10 col-sm-8 col-md-7 col-lg-6 col-xl-4">'+
                    '<h2 class ="errorBox-title">Oops ...</h2>'+
                        '<div class="errorBox-message">' +
                            '<p>L\'application semble avoir rencontré une erreur interne</p>' + fullDesc +
                        '</div>'+
                        '<div class="errorBox-button">'+
                            '<button onclick="document.location.reload(true);" class="btn-lg">Réessayer</button>'+
                        '</div>'+
                '</div>'+
            '</div>');
        $('body').append(slideNode);
    }
}
