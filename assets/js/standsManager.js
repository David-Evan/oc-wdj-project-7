import * as Config from './modules/config.js';
import * as Tools from './modules/tools.js';

export class StandsManager{

    initProperties(){
        this.standsCollection = [];
    }

    constructor()
    {
        this.initProperties();
        this.loadStands();
    }

    showStandDetails(standID){
        const standDetails = this.standsCollection.find( s => s.number === standID);

        let slideNode = Tools.htmlToElements(
            '<h2 class="station-title">'+standDetails.name+'</h2>'+
            '<div class="station-detail-number">#'+standDetails.number+'</div> ' +
            '<div class="station-detail-statut open">'+standDetails.status+'</div>' +
            '<div class="station-detail-adresse">'+standDetails.address+'</div> ' +
            '<div class="station-detail-available-bike-stand">'+standDetails.available_bike_stands+'</div> ' +
            '<div class="station-detail-bike">'+standDetails.available_bikes+'</div>');

        $('#StationDetailSection').html('').append(slideNode);
    }

    loadStands() {
        let APIurl = Config.Stands.API_GetAllsStandsURL.replace('{contract_name}', Config.Stands.contract)
            .replace('{api_key}', Config.JCDecauxAPIKey);

        $.ajax({
            url: APIurl,
            dataType: 'json',
            async:false
            }).done((data)=>{
                this.standsCollection = data;
        });
    }

    /*--- Getter / Setter ---*/

    /**
     * Renvoi la liste de toutes les stations
     * @returns {StandCollection}
     */
    getAllStands(){
        return this.standsCollection;
    }
}