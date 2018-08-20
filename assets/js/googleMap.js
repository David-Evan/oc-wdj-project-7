import {StandsManager} from "./standsManager.js";
/**
 * Google Map custom objet. This is the main start for the app.
 */
export class GoogleMap {

    /**
     * Init object properties - config can be used to change default values.
     * @param effectManager
     * @param config
     */
    initProperties(effectManager, config){
        this.contract = config && config.contract || 'Lyon';
        this.MCImagePath = config && config.MCImagePath || './assets/images/markerclusterer/m';
        this.iconPath = config && config.iconPath || './assets/images/map_icons/';
        this.icon = config && config.icon || {  fileExtension:        '.png',
                                                closedStand:          'icon-closed',
                                                numberIcon :          'icon-',
                                                moreAvailableBike :   'icon-x',};

        this.mapZoom = config && config.mapZoom || 13;
        this.mapStartPosition = config && config.mapStartPosition || {lat: 45.76, lng: 4.84};
        this.style = config && config.mapStyle || null;

        this.markersCollection = [];
        this.map = null;

        this.effectManager = effectManager;
        this.standManager = new StandsManager(this.effectManager);
    }

    /**
     * @param effectManager - instance of effect manager
     * @param config - inject config to changes defaults values
     * @param lazyStarting - Can be used to automated map display and add markers.
     */
    constructor(effectManager, config = false, lazyStarting = true) {
        this.initProperties(effectManager, config);

        if (lazyStarting) {
            this.createMap();
            this.addMapsMarkers();
        }

    }

    /**
     * get icon for each marker. This method can be used to change marker building conditions.
     * @param {google.maps.marker}- Google map marker
     * @returns {string|*} - return pictures file name
     */
    getIconForMaker(marker) {

        let icon;
        if(marker.standStatut == 'OPEN'){
            if(marker.standAvailableBikes < 25)
                icon = this.icon.numberIcon+marker.standAvailableBikes;
            else
                icon = this.icon.moreAvailableBike;
        }
        else
            icon = this.icon.closedStand;

        return icon + this.icon.fileExtension;
    }

    /**
     * Can be used to create Google Maps
     */
    createMap () {
        this.map = new google.maps.Map(document.getElementById('map'), {
                center: this.mapStartPosition,
                zoom: this.mapZoom,
                styles: this.style,
                gestureHandling: 'greedy',
            });
    }

    /**
     * It used to create marker with single stand data
     * @param stand {JSON} - Bike stand. JSON definited by JCDecaux API
     * @returns {google.maps.Marker}
     */
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
            this.standManager.createStandDetailsComponents(marker.standId);
        });

        return marker;
    }

    /**
     * Can be used to group marker with marker clusterer library
     * @returns {MarkerClusterer}
     */
    showMakersCollection(){
        return new MarkerClusterer(this.map, this.markersCollection, {imagePath: this.MCImagePath});
    }

    /**
     * Add marker on maps. (Data loading + Marker creation)
     */
    addMapsMarkers(){
        this.loadMakers();
        this.showMakersCollection();
    }

    /**
     * Convert and push all stands manager standsCollection into Google Map markerCollections
     */
    loadMakers() {
        this.standManager.getAllStands().forEach(
            stand =>
                this.markersCollection.push(this.createMarker(stand))
        );
    }

}
