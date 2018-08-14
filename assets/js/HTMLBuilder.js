import * as Tools from "./lib/tools.js";

/**
 * HTML Builder it used to create HTML component.
 */
export class HTMLBuilder{

    /**
     * Return a HTML Component for stand details. Ready to be insert in DOM
     * @param standDetails
     * @param haveBookingInStand
     * @return {NodeList}
     */
    static getStandDetailComponent(standDetails, haveBookingInStand) {

        // Few conditons to beautifull the result
        let standStatus = (standDetails.status === 'OPEN') ? 'Ouvert' : 'Fermé';
        let standAlert = '';
        if (standDetails.status !== 'CLOSED' && (standDetails.available_bike_stands === 0 || standDetails.available_bikes === 0))
            standAlert = ' carefull';

        let component =
            '<div class="station-detail-status btn ' + standDetails.status.toLowerCase() + standAlert + '">' + standStatus + '</div>' +
            '<h2 class="station-title">' + standDetails.name + '</h2>' +
            '<div class="station-detail-number">(n°' + standDetails.number + ')</div> ' +
            '<div class="station-detail-address"><i class="fas fa-map-marker-alt">&nbsp;</i> ' +
            '<p><adress>' + Tools.formatAddress(standDetails.address) + '</adress></p>' +
            '</div> ' +
            '<div class="station-detail-available-bike-park"><i class="fas fa-parking"></i>' +
            '<p> <strong>' + standDetails.available_bike_stands + '</strong> Places disponibles</p>' +
            '</div> ' +
            '<div class="station-detail-bike"><i class="fas fa-bicycle"></i>' +
            '<p><strong>' + standDetails.available_bikes + '</strong> Vélos disponibles</p>' +
            '</div>' +
            '<div class="station-detail-booking">';
        if (!haveBookingInStand) {
            component +=
                '<button id="bookABikeBtn' + standDetails.number + '" data-stand-name="' + standDetails.name.toLowerCase() + '" data-stand-number="' + standDetails.number + '" class="btn btn-lg">Réserver</button>';
        }
        else {
            component +='<p><strong>Reservation confirmée !</strong></p>';
        }

        return Tools.htmlToElements(component);
    }

    static getStatsComponent(stats){

        return   Tools.htmlToElements(
                '<h2 class="stats-title">Le saviez-vous ?</h2>'+
                '<p>Vélo\'<strong class="primary-color">V</strong> à Lyon, c\'est : </p>'+
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
    }


    static getCurrentBookingComponent(){
        return  Tools.htmlToElements(
             ' <h2 class="current-booking-title">Merci pour votre réservation!</h2>'+
             '<div class="current-booking-message">'+
                    '<p>Un vélo vous attend :</p>'+
                '<p id="currentBookingStandName" class="current-booking-stand"></p>'+
                '<p id="currentBookingExpiration"></p>'+
             '</div>'+
             '<div class="current-booking-button">'+
                '<button id="cancelBooking" class="btn btn-cancel">Annuler</button>'+
             '</div>');
    }
}