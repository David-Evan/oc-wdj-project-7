import * as Config from './modules/config.js';
import * as Tools from './lib/tools.js';
import {BookingManager} from "./bookingManager.js";
import {HTMLBuilder} from "./HTMLBuilder.js";

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
        this.stats = {availableBikes: 0,
                      availableParks: 0,
                      bikesOnRoad: 0};

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

        this.createStatsComponent();
    }

    createStandDetailsComponents(standID){
        this.effectManager.showStandDetailSection();

        // Get this stand details
        let standDetails = this.standsCollection.find( s => s.number === standID);

        console.log(standID +'--'+ this.bookingManager.booking.standID);
        let haveBookingInStand = (standID === Number(this.bookingManager.booking.standID));

        $(this.effectManager.idCollection.standDetailSection).html('').append(HTMLBuilder.getStandDetailComponent(standDetails, haveBookingInStand));

        // Add effects
        this.effectManager.showStandInfoSection();
        this.effectManager.hideBookingSection();

        this.bookingManager.addBookABikeEventListener(standDetails.number);
    }

    /**
     * Create HTML Stats section.
     * TODO  Remove direct ID
     */
    createStatsComponent(){
        $('#statsSection').append(
                HTMLBuilder.getStatsComponent(
                    this.getStandsStats()));
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
            this.standsCollection.forEach(stand => {
                // Remove the #xxx number before stand name
                stand.name = stand.name.split('-')[1];

                // Create stats at this moment to avoid duplicate forEach()
                this.calculateStats(stand);
            })
        });
        dataRequest.fail(()=>{ throw new Error('Échec de la récupération des données. <br/> Plus d\'infos dans la console.')});
    }

    /**
     * Calculate stands stats
     *
     * @param stand {{availableBikes: number, availableParks: number, bikesOnRoad: number}}
     */
    calculateStats(stand){
        this.stats.availableBikes += stand.available_bikes;
        this.stats.availableParks += stand.available_bike_stands;
        this.stats.bikesOnRoad += (stand.bike_stands - stand.available_bike_stands);
    }


    /*--- Getter / Setter ---*/
    /**
     * Return Stands stats
     * @return {{availableBikes: number, availableParks: number, bikesOnRoad: number}}
     */
    getStandsStats(){
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
