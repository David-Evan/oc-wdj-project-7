import {SignaturePad} from "./modules/signaturePad.js";
import {HTMLBuilder} from "./HTMLBuilder.js";

/**
 * Booking Manager
 */
export class BookingManager{

    /**
     * Init object properties - config can be used to change default values.
     * @param effectManager
     * @param config
     */
    initProperties(effectManager, config){
        this.bookingDuration = config && config.bookingDuration || 20; // time in minutes
        this.bookingSectionID = config && config.bookingSectionID || '#bookingSection';

        this.currentBookingSectionID = config && config.currentBookingSectionID || '#currentBookingSection';

        this.bikeBooked = false;
        this.booking = {date :null,
                        standID: null,
                        name: null,};

        this.countDownTimer = null;

        this.signaturePad = new SignaturePad('signatureContainer',
                                            ()=>this.bookABike()); // Callback function - see : SignaturePad
        this.effectManager = effectManager;
    }

    /**
     * @param config
     */
    constructor(effectManager, config = false){
        this.initProperties(effectManager, config);
        this.createCurrentBookingComponent();

        this.addCancelBookingEventListener();

        this.effectManager.hideBookingSection();
        this.effectManager.hideCurrentBookingSection();
    }

    createCurrentBookingComponent(){
        $(this.effectManager.idCollection.currentBookingSection).html('').append(HTMLBuilder.getCurrentBookingComponent());
    }

    /**
     * Add event listener for each "Booking" button
     * @param standID
     */
    addBookABikeEventListener(standID){
        const $this = $('#bookABikeBtn'+standID).on('click', ()=>{

            if(this.bikeBooked && !confirm('Vous êtes sur le point d\'annuler votre réservation déjà existante. \n\nÊtes vous sûr de vouloir continuer ?'))
                return;

            // Push booking in memory
            this.booking.standID = $this.data('standNumber');
            this.booking.name = $this.data('standName');

            this.effectManager.showBookingSection();
            this.effectManager.hideCurrentBookingSection();

            $('#bookABikeBtn'+this.booking.standID).remove();
        });
    }

    /**
     * Add event listener to "cancel" booking button
     */
    addCancelBookingEventListener() {
        $('#cancelBooking').on('click', () => {
            if(this.bikeBooked && confirm('Êtes vous sûr de vouloir annuler votre réservation ?'))
                this.cancelBookedBike();
        });
    }

    /**
     * Book a bike
     */
    bookABike(){
        this.bikeBooked = true;
        this.booking.date = Date.now();

        $('#currentBookingStandName').html(this.booking.name);

        // * 60 * 1000 = convert time in minutes to miliseconds timestamps
        this.addCountdownBookingTimer((this.booking.date + (this.bookingDuration* 60 * 1000)), 'currentBoolingExpiration');

        this.effectManager.bookABikeEffect();
        this.saveBookingInStorage();
    }

    /**
     * Save booking in storage. Can be customize to allow multi-storage locations or interact with external database
     */
    saveBookingInStorage(){
        sessionStorage.setItem('booking', JSON.stringify(this.booking));
    }

    /*
     * Delete the actual booking in storage
     */
    deleteBookingInStorage(){
        sessionStorage.setItem('booking', '');
    }

    /**
     * Used to cancel booked bike.
     */
    cancelBookedBike(){

        this.bikeBooked = false;
        this.booking = {};

        this.deleteBookingInStorage();

        this.effectManager.hideCurrentBookingSection();

        clearInterval(this.countDownTimer);
    }

    /**
     * Display a countdown timer.
     * @param deadline {int}.
     * @param bookingSectionID {string}
     */
    addCountdownBookingTimer(deadline, bookingSectionID) {

        let remainingTime = deadline - Date.now();
        let minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        this.bookingReamingTime = {min: minutes, sec:seconds};

        this.countDownTimer = setInterval(() => {
            $('#currentBookingExpiration').html('Il vous reste : ' + '<span class="bookingRemainingTime">'+ this.bookingReamingTime.min + ' min ' + this.bookingReamingTime.sec+' sec </span> pour l\'enfourcher !');

            if(this.bookingReamingTime.sec <= 0){
                this.bookingReamingTime.sec = 60;
                this.bookingReamingTime.min--;
            }
                this.bookingReamingTime.sec--;

            if (this.bookingReamingTime.min <= 0 && this.bookingReamingTime.sec <= 0) {
                clearInterval(this.countDownTimer);
                $(this.effectManager.idCollection.currentBookingSection).html('<p class="text-center"><strong>Aaaaaw nooo ! </strong><br/><img src="./assets/images/sadness.jpg" alt="Personnage pixar pleurant" /><br/> Votre réservation a expériée.</p>');

                this.bikeBooked = false;
                this.booking = {};

                this.deleteBookingInStorage();
                this.createCurrentBookingComponent();
            }
        }, 1000);
    }
}
