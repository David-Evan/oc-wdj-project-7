import {SignaturePad} from "./modules/signaturePad.js";

export class BookingManager{

    initProperties(){

        this.bikeBooked = false;
        this.booking = {date :null,
                        standID: null};

        this.signaturePad = new SignaturePad('signatureContainer');
    }

    constructor(){
        this.initProperties();

        $(this.signaturePad.signaturePadID).hide();
    }

    addBookABikeEventListener(standID){
        const $this = $('#'+standID).on('click', ()=>{
            $this.data('standNumber')
            /*DO SOMETHING*/
            $(this.signaturePad.signaturePadID).show();
        });
    }
    showBookABikePanel(standID){

    }

    bookABike(){

    }

    cancelBookedBike(){}

    showBookedBikePanel(){

    }

}