import {SignaturePad} from "./modules/signaturePad.js";

/**
 * Gestionnaire de réservation
 */
export class BookingManager{

    /**
     * Initialise les propriétés de l'objet
     * @param config
     */
    initProperties(effectManager, config){
        // (En minutes)
        this.bookingDuration = config && config.bookingDuration || 20;
        this.bookingSectionID = config && config.bookingSectionID || '#bookingSection';

        this.currentBookingSectionID = config && config.currentBookingSectionID || '#currentBookingSection';

        this.bikeBooked = false;
        this.booking = {date :null,
                        standID: null,
                        name: null,};

        this.countDownTimer = null;

        this.signaturePad = new SignaturePad('signatureContainer',
                                            ()=>this.bookABike());
        this.effectManager = effectManager;
    }

    /**
     * @param config - Permet d'injecter des configurations pour modifier le comportement par défaut
     */
    constructor(effectManager, config = false){
        this.initProperties(effectManager, config);

        this.addCancelBookingEventListener();

        $(this.bookingSectionID).hide();
        $(this.currentBookingSectionID).hide();
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

            if(this.bikeBooked && !confirm('Vous êtes sur le point d\'annuler votre réservation déjà existante. \n\nÊtes vous sûr de vouloir continuer ?'))
                return;

            // Push booking in memory
            this.booking.standID = $this.data('standNumber');
            this.booking.name = $this.data('standName');

            $(this.bookingSectionID).show();
            $(this.currentBookingSectionID).hide();
        });
    }

    addCancelBookingEventListener() {
        $('#cancelBooking').on('click', () => {
            if(this.bikeBooked && confirm('Êtes vous sûr de vouloir annuler votre réservation ?'))
                this.cancelBookedBike();
        });
    }

    /**
     * Permet la réservation d'un vélp
     */
    bookABike(){
        this.bikeBooked = true;
        this.booking.date = Date.now();

        $('#currentBookingStandName').html(this.booking.name);

        // * 60 * 1000 = convert time in minutes to miliseconds timestamps
        this.addCountdownBookingTimer((this.booking.date + (this.bookingDuration* 60 * 1000)), 'currentBoolingExpiration');
        $(this.currentBookingSectionID).show();
        $(this.bookingSectionID).hide();

        this.saveBookingInStorage();
    }

    /**
     * Permet la sauvegarde de la reservation
     * Ce comportement est délégué à une méthode séparée pour permettre
     * l'ajout d'un nouveau comportement : Sauvegarde dans une base de données extérieur par exemple
     */
    saveBookingInStorage(){
        sessionStorage.setItem('booking', JSON.stringify(this.booking));
    }

    /**
     */
    deleteBookingInStorage(){
        sessionStorage.setItem('booking', '');
    }

    cancelBookedBike(){

        this.bikeBooked = false;
        this.booking = {};

        this.deleteBookingInStorage();
        $(this.currentBookingSectionID).hide();
        clearInterval(this.countDownTimer);
    }

    /**
     * Display a countdown timer.
     * @param deadline {int}.
     * @param bookingSectionID {string}
     * @param bookingCountDownTimerSpanID {string}
     */
    addCountdownBookingTimer(deadline, bookingSectionID) {

        let remainingTime = deadline - Date.now();
        let minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        this.bookingReamingTime = {min: minutes, sec:seconds};

        this.countDownTimer = setInterval(() => {
            document.getElementById('currentBoolingExpiration').innerHTML = 'Il vous reste : ' + '<span class="bookingRemainingTime">'+ this.bookingReamingTime.min + ' min ' + this.bookingReamingTime.sec+' sec </span> pour l\'enfourcher !';

            if(this.bookingReamingTime.sec <= 0){
                this.bookingReamingTime.sec = 60;
                this.bookingReamingTime.min--;
            }
                this.bookingReamingTime.sec--;

            if (this.bookingReamingTime.min <= 0 && this.bookingReamingTime.sec <= 0) {
                clearInterval(this.countDownTimer);
                document.getElementById('currentBookingSection').innerHTML = '<p class="text-center"><strong>Aaaaaw nooo ! </strong><br/><img src="./assets/images/sadness.jpg" alt="Personnage pixar pleurant" /><br/> Votre réservation a expériée.</p>';
            }
        }, 1000);
    }
}
