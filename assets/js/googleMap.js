import * as Config from './modules/config.js';

export class GoogleMap {

    initProperties(config){
        this.contract = config && config.contract || 'Lyon';
        this.MCImagePath = config && config.MCImagePath || './assets/images/markerclusterer/m';
    }

    constructor() {
        this.initProperties();

        this.createMap();
        this.addMapsMarkers();
    }

    createMap () {
        this.allStationsPosition = [];
        this.map = new google.maps.Map(document.getElementById('map'), {
                center: {
                    lat: 45.7563172,
                    lng: 4.827523
                },
                zoom: 13,
                minZoom: 11,
            });
    }

    createMarker(position) {
        return new google.maps.Marker({position: position});
    }

    showMakersCollection(){
        new MarkerClusterer(this.map, this.allStationsPosition,
            {imagePath: this.MCImagePath});
    }

    addMapsMarkers(){

        let APIurl = Config.BikeStations.API_GetAllsStationsURL.replace('{contract_name}', Config.BikeStations.contract)
                                                               .replace('{api_key}', Config.JCDecauxAPIKey);
        $.getJSON(APIurl,
            (data)=> {
                data.forEach((station)=>{
                    this.allStationsPosition.push(this.createMarker(station.position));
                });
                this.showMakersCollection();
            });
    }
}