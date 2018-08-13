import * as Config from './modules/config.js';
import * as Tools from './modules/tools.js';
import {BookingManager} from "./bookingManager.js";

/**
 * This is the Stands Manager. It used to load stand collection.
 */
export class StandsManager{

    /**
     * Init object properties - config can be used to change stands manager default values.
     * @param config
     */
    initProperties(effectManager, config){

        this.bookingBtnContent = config && config.bookingBtnContent || 'Réserver un Vélo';

        this.standsCollection = [];
        this.stats = {};

        this.effectManager = effectManager;
        this.bookingManager = new BookingManager(this.effectManager);
    }

    /**
     * When the stand manager is created, it try to load data from JCDECAUX API
     * @param config
     */
    constructor(effectManager, config=false)
    {
        this.initProperties(effectManager, config);
        this.loadStands();

        // TODO : Change this method
        this.createHTMLStatsSection();
    }

    /**
     * // TODO : Need to be rebuild
     * Show single stand details
     * @param standID {int} - Bike standID
     */
    showStandDetails(standID){

        this.effectManager.showStandDetailSection();
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
     * Create HTML Stats section.
     */
    createHTMLStatsSection(){

        let stats = this.getStandsStats();

        let slideNode = Tools.htmlToElements(
            '<h2 class="stats-title">Le saviez-vous ?</h2>'+
            '<p>Vélo\'V à Lyon, c\'est : </p>'+
            '<div class="stats-detail-bike-on-road"><i class="fas fa-road">&nbsp;</i> ' +
                '<p><strong>'+Tools.numberWithSpaces(stats.bikesOnRoad)+'</strong> Cycliste sur la route </p></p>' +
            '</div>'+
            '<div class="stats-detail-bike"><i class="fas fa-bicycle primary-color"></i>' +
                '<p><strong>'+Tools.numberWithSpaces(stats.availableBikes)+'</strong> Vélos disponibles</p>' +
            '</div>' +
            '<div class="stats-available-bike-park"><i class="fas fa-parking"></i>' +
                '<p> <strong>'+Tools.numberWithSpaces(stats.availableParks)+'</strong> Places disponibles</p>' +
            '</div> '
        );

        $('#statsSection').append(slideNode);
    }

    /**
     * TODO : load async data
     * load stands from JCDecaux API and push them into standsCollection.
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
     * Return somes stats for JCDecaux Lyon bikes service
     * @return {{availableBikes: number, availableParks: number, bikesOnRoad: number}}
     */
    getStandsStats(){
        // Didn't repeat the foreach if already done before

        let availablesBikes = 0;
        let availableParks = 0;
        let bikesOnRoad = 0;

        if($.isEmptyObject(this.stats)) {
            this.standsCollection.forEach(stand => {
                availablesBikes += stand.available_bikes;
                availableParks += stand.available_bike_stands;
                bikesOnRoad += (stand.bike_stands - stand.available_bike_stands);
            });
            return this.stats = {availableBikes: availablesBikes, availableParks: availableParks, bikesOnRoad: bikesOnRoad};
        }
        else
            return this.stats;
    }


    /**
     * Return the standsCollection
     * @returns {array}
     */
    getAllStands(){
        return this.standsCollection;
    }
}
