import {SignaturePad} from "./modules/signaturePad.js";

export class BookingManager{

    initProperties(config){
        // (En minutes)
        this.bookingDuration = config && config.bookingDuration || 20;

        this.bikeBooked = false;
        this.booking = {date :null,
                        standID: null};

        this.signaturePad = new SignaturePad('signatureContainer',
                                            ()=>this.bookABike());
    }

    constructor(config = false){
        this.initProperties(config);
        $(this.signaturePad.signaturePadID).hide();
    }

    addBookABikeEventListener(standID){
        const $this = $('#'+standID).on('click', ()=>{
            // Mise en mémoire de la réservation
            this.booking.standID = $this.data('standNumber');

            $(this.signaturePad.signaturePadID).show();
        });
    }

    showBookABikePanel(standID){

    }

    bookABike(){
        this.bikeBooked = true;
        this.booking.date = Date.now();
        
        $(this.signaturePad.signaturePadID).hide();
    }

    cancelBookedBike(){}

    showBookedBikePanel(){

    }

}