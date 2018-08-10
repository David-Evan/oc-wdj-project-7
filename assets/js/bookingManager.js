import {SignaturePad} from "./modules/signaturePad.js";

/**
 * Gestionnaire de réservation
 */
export class BookingManager{

    /**
     * Initialise les propriétés de l'objet
     * @param config
     */
    initProperties(config){
        // (En minutes)
        this.bookingDuration = config && config.bookingDuration || 20;

        this.bikeBooked = false;
        this.booking = {date :null,
                        standID: null};

        this.signaturePad = new SignaturePad('signatureContainer',
                                            ()=>this.bookABike());
    }

    /**
     * @param config - Permet d'injecter des configurations pour modifier le comportement par défaut
     */
    constructor(config = false){
        this.initProperties(config);
        $(this.signaturePad.signaturePadID).hide();
    }

    /**
     * Ajoute un écouteur d'évenement associé à un bouton "reservation". Le standID est important
     * Il permet d'identifier le boutton à associer à la reservation et de pouvoir utiliser plusieurs
     * BookingManager sur la même interface, le cas échéant.
     *
     * @param standID
     */
    addBookABikeEventListener(standID){
        const $this = $('#'+standID).on('click', ()=>{
            // Mise en mémoire de la réservation
            this.booking.standID = $this.data('standNumber');

            $(this.signaturePad.signaturePadID).show();
        });
    }

    /**
     * TODO : showBookABikePanel - Délégation du formulaire de réseration au BookingManager
     * @param standID
     */
    showBookABikePanel(standID){

    }

    /**
     * Permet la réservation d'un vélp
     */
    bookABike(){
        this.bikeBooked = true;
        this.booking.date = Date.now();
        $(this.signaturePad.signaturePadID).hide();

        this.saveBooking();
    }

    /**
     * Permet la sauvegarde de la reservation
     * Ce comportement est délégué à une méthode séparée pour permettre
     * l'ajout d'un nouveau comportement : Sauvegarde dans une base de données extérieur par exemple
     */
    saveBooking(){
        sessionStorage.setItem('booking', JSON.stringify(this.booking));
    }

    /**
     * Renvoie la reservation
     * @returns {JSON}
     */
    getBooking(){
        return JSON.parse(sessionStorage.getItem('booking'));
    }

    cancelBookedBike(){}

    showBookedBikePanel(){
    }
}