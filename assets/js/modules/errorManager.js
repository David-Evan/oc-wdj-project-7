import * as Tools from './tools.js';

/**
 * Gestionnaire d'erreur
 */
export class ErrorManager{

    /**
     * Initialise les propriétés de l'objet
     * @param error - {Error} Erreur à gérer (instance of Error)
     * @param config
     */
    initProperties(error, config){

        this.enabledFullDescription = config && config.enabledFullDescription || false;

        this.error = error;
    }

    /**
     * Permet la gestion des erreurs
     * @param error
     * @param config
     */
    constructor(error, config = false) {
        this.initProperties(error, config);
        this.createHTMLError();
    }

    /**
     * Permet la création du composant HTML pour la gestion des erreurs et l'affiche
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
