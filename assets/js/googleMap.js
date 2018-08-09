import {BookingManager} from './bookingManager.js';
import {StandsManager} from "./standsManager.js";

export class GoogleMap {

    initProperties(config){
        this.contract = config && config.contract || 'Lyon';
        this.MCImagePath = config && config.MCImagePath || './assets/images/markerclusterer/m';

        this.iconPath = config && config.iconPath || './assets/images/map_icons/';
        this.icon = config && config.icon || {  fullStand:          'stand-100.png',
                                                threeQuarterStand:  'stand-75.png',
                                                halfStand:          'stand-50.png',
                                                quarterStand:       'stand-25.png',
                                                emptyStand:         'stand-0.png'};

        this.markersCollection = [];
        this.map = null;

        this.standManager = new StandsManager();
        // this.bookingManager = new bookingManager();
    }

    constructor(config = false, lazyStarting = true) {
        this.initProperties(config);

        if (lazyStarting) {
            this.createMap();
            this.addMapsMarkers();
        }
    }

    getIconForMaker(marker) {

        let standCapacityRatio = (marker.standAvailableParks / marker.standCapacity);
        let icon = null;
        if(standCapacityRatio == 1)
            icon = this.icon.emptyStand;
        else if(standCapacityRatio == 0)
            icon = this.icon.fullStand;
        else if(standCapacityRatio <=0.35)
            icon = this.icon.quarterStand;
        else if(standCapacityRatio <=0.65)
            icon = this.icon.halfStand;
        else if(standCapacityRatio < 1)
            icon = this.icon.threeQuarterStand;
        else
            icon = this.icon.halfStand;

        return icon;
    }

    createMap () {
        this.map = new google.maps.Map(document.getElementById('map'), {
                center: {
                    lat: 45.76,
                    lng: 4.84
                },
                zoom: 13,
                minZoom: 11,
            });
    }

    createMarker(stand) {
        let marker =  new google.maps.Marker({
                            position: stand.position,
                            standId: stand.number,
                            standStatut: stand.status,
                            standCapacity : stand.bike_stands,
                            standAvailableParks: stand.available_bike_stands,
                            standAvailableBikes: stand.available_bikes,
                            icon : this.icon.emptyStand,
                            });

        marker.icon = this.iconPath+this.getIconForMaker(marker);

        marker.addListener('click', ()=> {
            this.map.setCenter(marker.position);
        });

        return marker;
    }

    showMakersCollection(){
        return new MarkerClusterer(this.map, this.markersCollection, {imagePath: this.MCImagePath});
    }

    addMapsMarkers(){
        this.loadMakers();
        this.showMakersCollection();
    }

    loadMakers() {
        this.standManager.getAllStands().forEach(
            stand =>
                this.markersCollection.push(this.createMarker(stand))
        );
    }
}