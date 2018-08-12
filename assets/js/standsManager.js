import * as Config from './modules/config.js';
import * as Tools from './modules/tools.js';
import {BookingManager} from "./bookingManager.js";

/**
 * Gestionnaire de Station
 */
export class StandsManager{

    /**
     * Initialise les propriétés de l'objet
     * @param config
     */
    initProperties(effectManager, config){

        this.bookingBtnContent = config && config.bookingBtnContent || 'Réserver un Vélo';
        this.standsCollection = [];

        this.effectManager = effectManager;
        this.bookingManager = new BookingManager(this.effectManager);
    }

    /**
     * Assure le chargement de la configuration et lance la récupération des données
     * @param config
     */
    constructor(effectManager, config=false)
    {
        this.initProperties(effectManager, config);
        this.loadStands();
    }

    /**
     * Affiche les détails d'une station de vélo
     * @param standID {int} - ID de la station de vélo
     */
    showStandDetails(standID){
        // Few conditons to beautifull the result
        let standDetails = this.standsCollection.find( s => s.number === standID);

        let standStatus = (standDetails.status === 'OPEN') ? 'Ouvert' : 'Fermé';
        let standAlert = '';

        if(standDetails.status !== 'CLOSED' && (standDetails.available_bike_stands == 0 || standDetails.available_bikes == 0))
            standAlert = ' carefull';

        // Detail section building
        let slideNode = Tools.htmlToElements(

                '<div class="station-detail-status btn '+standDetails.status.toLowerCase()+standAlert+'">'+standStatus+'</div>' +
                '<h2 class="station-title">'+standDetails.name+'</h2>'+
                '<div class="station-detail-number">(n°'+standDetails.number+')</div> ' +
                '<div class="station-detail-address"><i class="fas fa-map-marker-alt">&nbsp;</i> ' +
                    '<p><adress>'+Tools.formatAddress(standDetails.address)+'</adress></p>' +
                '</div> ' +
                '<div class="station-detail-available-bike-park"><i class="fas fa-parking"></i>' +
                    '<p> <strong>'+standDetails.available_bike_stands+'</strong> Places disponibles</p>' +
                '</div> ' +
                '<div class="station-detail-bike"><i class="fas fa-bicycle"></i>' +
                    '<p><strong>'+standDetails.available_bikes+'</strong> Vélos disponibles</p>' +
                '</div>' +
                '<div class="station-detail-booking">' +
                    '<button id="bookABikeBtn'+standDetails.number+'" data-stand-name="'+standDetails.name.toLowerCase()+'" data-stand-number="'+standDetails.number+'" class="btn btn-lg">'+this.bookingBtnContent+'</button>' +
                '</div>');

        $('#standDetailSection').html('').append(slideNode);
        this.effectManager.showStandInfoSection();

        $('#bookingSection').hide();
        this.bookingManager.addBookABikeEventListener('bookABikeBtn'+standDetails.number);
    }


    /**
     * TODO : Asynchronisme
     * Permet le chargement des données au sein de standsCollection
     */
    loadStands() {
        let APIurl = Config.Stands.API_GetAllsStandsURL.replace('{contract_name}', Config.Stands.contract)
            .replace('{api_key}', Config.JCDecauxAPIKey);

        let dataRequest = $.ajax({
                    url: APIurl,
                    dataType: 'json',
                    async:false
                    });

        dataRequest.done(data => {
            this.standsCollection = data;
            this.standsCollection.forEach(stand => stand.name = stand.name.split('-')[1]) // Remove the #xxx number before stand name
        });

        dataRequest.fail(()=>{ throw new Error(' Échec de la récupération des données. <br/> Plus d\'infos dans la console.')});

    }

    /*--- Getter / Setter ---*/

    /**
     * Renvoi la liste de toutes les stations
     * @returns {array}
     */
    getAllStands(){
        return this.standsCollection;
    }
}
