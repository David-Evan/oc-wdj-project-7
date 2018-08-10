import * as Tools from './tools.js';

/**
 * Représente une zone de signature
 */
export class SignaturePad{

    /**
     * Initialise les propriétés de l'objet
     * @param config
     * @param callbackFunction
     */
    initProperties(config, callbackFunction) {
        this.signaturePadID = null;
        this.canvasID = null; // ID de <canvas>
        this.canvasElement = null; // Element JS canvas
        this.canvasContext = null; // Canvas context

        this.signatureLabel = config && config.signatureLabel || "Signature";
        this.btnAcceptLabel = config && config.btnAcceptLabel || "Signer";
        this.btnResetLabel = config && config.btnResetLabel || "Effacer";
        this.signatureTitle = config && config.signatureTitle || "Afin de confirmer votre réservation, merci de signer ci-dessous";

        this.callbackFunction = callbackFunction;
    }

    /**
     * Créée une nouvelle zone de signature.
     * @param containerID {string} - ID du container à utiliser pour la création de la zone.
     * @param callbackFunction - {callback function} - Fonction à executer après validation de la signature.
     * @param config - {json}- Données de config à utiliser. Si false, la config par defaut sera utilisée
     * @param lazyStarting {Boolean} - Permet la création et le démmarage automatique du composant
     */
    constructor(containerID, callbackFunction, config = false, lazyStarting = true){
        this.initProperties(config, callbackFunction);
        this.containerID = '#'+containerID;

        if(lazyStarting)
        {
            this.createHTMLSignaturePad();
            this.initCanvas();

            this.startEventsListener();
        }
    }

    /**
     * Initialise les propriétés de la zone de Canvas :
     * CanvasElement et CanvasContext qui seront utilisé par l'objet
     */
    initCanvas(){
        this.canvasElement = document.getElementById(this.canvasID.substring(1));
        this.canvasContext = this.canvasElement.getContext('2d');
    }

    /**
     * Permet la création des composants HTML
     */
    createHTMLSignaturePad(){
        let signaturePadNode = Tools.htmlToElements(
            '<h3>'+this.signatureTitle+'</h3>' +
            '<div class="signatureLabel">' + this.signatureLabel + '</div>' +
            '<canvas id="'+this.canvasID.substring(1)+'" class="signatureCanvas"></canvas>' +
            '<div class="signatureControls">' +
            '<button class="btn sign">'+this.btnAcceptLabel+'</button>' +
            '<button class="btn reset">'+this.btnResetLabel+'</button> ' +
            '</div>');

        $(this.signaturePadID).append(signaturePadNode);
    }

    /**
     * Lance les écouteur d'événements
     */
    startEventsListener(){
        this.addButtonEventsListener();
        this.addMouseEventsListener();
    }

    /**
     * Ajoute les écouteurs d'évenements sur la souris
     */
    addMouseEventsListener() {
        $(this.canvasID).on('mousedown', (e)=> this.mouseDownEvent(e));
        $(this.canvasID).on('mouseup', ()=> this.mouseUpEvent());
    }

    /**
     * Ajoute les écouteurs d'événements sur les boutons "Sign" & "Reset"
     */
    addButtonEventsListener() {
        $(this.signaturePadID + ' .btn.reset').on('click',()=> this.resetSignaturePad());
        $(this.signaturePadID + ' .btn.sign').on('click',()=> this.validateSignaturePad());
    }

    /**
     * Evenement - Évenement déclenché au click de la souris
     * @param e - Evenement
     */
    mouseDownEvent(e){
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(e.offsetX, e.offsetY);
        $(this.canvasID).on('mousemove', (e)=> this.paintCanvas(e));
    }

    /**
     * Evenement - Évenement déclenché au relachement de la souris
     */
    mouseUpEvent(){
        $(this.canvasID).off('mousemove');
    }

    /**
     * Fonction permettant de déssiner dans la zone de Canvas
     * @param e Evenement (mousemove)
     */
    paintCanvas(e) {
        this.canvasContext.lineTo(e.offsetX, e.offsetY);
        this.canvasContext.stroke();
    }

    /**
     * Réinitialise la zone de signature
     */
    resetSignaturePad() {
        this.canvasContext.clearRect(0,0,
            this.canvasElement.width,
            this.canvasElement.height);
    }

    /**
     * Renvoi l'image du canvas pour sauvegarde
     * @returns {Uint8ClampedArray}
     */
    getSignatureImage() {
        return this.canvasContext.getImageData(0, 0,
            this.canvasElement.width,
            this.canvasElement.height).data;
    }

    /**
     * Fonction appelé après avoir "signé" le formulaire
     * Exécute la fonction de callback après vérification du contenu.
     */
    validateSignaturePad(){

        this.resetSignaturePad();

        this.callbackFunction();
    }

    /*--- Getter / Setter ---*/
    /**
     * set containerID() - Défini l'id du container html à utiliser pour la
     * création de la zone de signature
     * Lève une erreur si le container n'existe pas.
     * @param id - Nom du container
     */
    set containerID(id) {
        if ($(id).length > 0)
        {
            this.signaturePadID = id;
            this.canvasID = id + '_canvas';
        }
        else {
            throw 'SIGNATURE PAD ERROR: \n ' + id + ' is an unknow DOM ID | Slideshow need a container to be displayed';
        }
    }
}