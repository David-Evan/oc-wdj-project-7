import * as Tools from '../lib/tools.js';
/**
 * Slideshow - Représente le diaporama.
 */
export class Slideshow {

    /**
     * Initialise les propriétes de l'objet
     */
    initProperties(config) {
        this.slideshowID = null;
        this.index = 0;
        this.slideAnimation = null;

        this.slidesCollection = config && config.slidesCollection;
        this.imageDirectory = config && config.imageDirectory || '../../images/slideshow/';
        this.slideWidth = config && config.slideWidth || '900px';
        this.slideHeight = config && config.slideHeight || '600px';
        this.slideChangeDuration = config && config.slideChangeDuration || 700;
        this.nextSlideDelay = config && config.nextSlideDelay || 7000;
        this.enabledKeyboardControls = config && config.enabledKeyboardControls || true;
    }

    /**
     * constructor - Créée un nouveau slideshow.
     * @param containerID - {String} Nom du container à utiliser pour l'affichage
     * @param slidesCollection - {Array}- Données à utiliser sous la forme :
     * [{imageUrl: string, title: string, textContent : string}]
     * @param config - {json}- Données de config à utiliser. Si false, la config par defaut sera utilisée
     * @param lazyStarting {Boolean} - Permet la création et le démmarage automatique du composant
     */
    constructor(containerID, config = false ,lazyStarting = true) {
        this.initProperties(config);
        this.containerID = '#'+containerID;

        if (this.slidesCollection.length > 0)
            this.addSlideCollection(this.slidesCollection);

        if(lazyStarting) {
            this.createHTMLSlideshow();
            this.changeIndex(0,0);
            this.start();
            this.startEventsListener();
        }
    }

    /**
     * Ajoute un ou plusieur slide à la collection
     * @param slidesCollection - {Array} -  Ajoute une collection de diapo à la liste
     * @param addFirst - {Boolean} - Si true, l'ajoute au début
     */
    addSlideCollection(slidesCollection, addFirst = false) {
        if (addFirst)
            this.slidesCollection = slidesCollection.concat(this.slidesCollection);
        else
            this.slidesCollection = this.slidesCollection.concat(slidesCollection);
    }

    /**
     * Ajoute une diapositive au slider
     * @param slide - {json}- diapositive au format {imageUrl: string, title: string, textContent : string}
     * @param addFirst - {Boolean} - Si true, ajoute la diapositive au début de la liste
     */
    addSlide(slide, addFirst = false){
        if(addFirst)
            this.slidesCollection.unshift(slide);
        else
            this.slidesCollection.push(slide);
    }

    /**
     * Affiche la diapositive suivante
     */
    showNext(){
        if ((this.index + 1) > (this.slidesCollection.length -1))
            this.changeIndex(this.index, 0);
        else
            this.changeIndex(this.index, this.index+1);
    }

    /**
     * Affiche la diapositive précédente
     */
    showPrevious(){
        if ((this.index-1) < 0)
            this.changeIndex(this.index, this.slidesCollection.length -1);
        else
            this.changeIndex(this.index, this.index - 1);
    }

    /**
     * Lance l'animation du diaporama
     */
    start(){
        this.slideAnimation = setInterval(()=>{
            this.showNext();
        }, this.nextSlideDelay);
    }

    /**
     * Met en pause l'animation
     */
    stop(){
        clearInterval(this.slideAnimation);
    }

    /**
     * Permet de changer la diapositive afficher.
     * @param currentIndex - {int} Diapositive actuelle
     * @param newIndex - {int} Nouvelle diapositive
     */
    changeIndex(currentIndex, newIndex) {
        let $thisCurrentIndex = $('#'+Tools.slugify(this.slidesCollection[currentIndex].title));

        let $thisNewIndex = $('#'+Tools.slugify(this.slidesCollection[newIndex].title));

        $thisCurrentIndex.fadeOut(this.slideChangeDuration);
        $thisNewIndex.fadeIn(this.slideChangeDuration);

        this.index = newIndex;
    }

    /**
     * Créée une diapositive HTML à partir d'un objet json
     * @param slide - {JSON}
     */
    createHTMLSlide(slide){
        let slideNode = Tools.htmlToElements(
                            '<figure id ="'+Tools.slugify(slide.title)+'" ' +
                                    'class="slide" ' +
                                    'style="background: url('+this.imageDirectory+slide.imageURL+');' +
                                            'width: '+this.slideWidth+ '; ' +
                                            'height:'+this.slideHeight +';' +
                                            'display: none;' +
                                            'position: absolute;">' +
                            '<h3>'+slide.title+'</h3>' +
                            '<figcaption>'+ slide.textContent +'</figcaption>' +
                            '</figure>');
        $(this.slideshowID).append(slideNode);
    }

    /**
     * Create close button html control
     */
    createHTMLCloseButton(){
        let slideNode = Tools.htmlToElements('<div id="slideshowCloseButton">Fermer &nbsp;<i class="fas fa-times"></i></div>');
        $(this.slideshowID).append(slideNode);
    }

    /**
     *  Créée un diaporama HTML et l'insert
     * @param newSlidesCollection - Permet l'ajout d'une nouvelle collection à la volée.
     * @param addMethod - Défini la manière d'ajouter la nouvelle collection :
     *                    addAtEnd, push : l'ajoute à la fin de la liste déjà existante
     *                    addAtBeginning, unshift : l'ajoute au début
     *                    default : Réinitialise la liste pour la remplacer par la nouvelle.
     */
    createHTMLSlideshow(newSlidesCollection = false, addMethod = 'reset'){

        this.createHTMLCloseButton();

        if(newSlidesCollection !== false) {
            switch (addMethod) {
                case 'addAtEnd':
                case 'push':
                    this.addSlideCollection(newSlidesCollection);
                    break;
                case 'addAtBeginning':
                case 'unshift':
                    this.addSlideCollection(newSlidesCollection, true);
                    break;
                default:
                    this.slidesCollection = newSlidesCollection;
            }
        }

        $(this.slideshowID).append(null); // reset container
        this.slidesCollection.forEach((slide)=>{
            this.createHTMLSlide(slide);
        });

        this.createHTMLControls();
    }

    /**
     * Permet la création de boutons de controls
     * @param displayControls {boolean} - Affiche ou non les controls (display:none);
     */
    createHTMLControls(displayControls = true){

        let displayed = displayControls ? '' : ' display:none;';
        let slideNode = Tools.htmlToElements(
            '<div class="slideshow-controls-section" style="position: absolute; z-index:100;'+displayed+'">' +
              '<div class="slideshow-controls next"><i class="fas fa-chevron-right"></i></div>' +
              '<div class="slideshow-controls prev"><i class="fas fa-chevron-left"></i></div>' +
            '</div>');
        $(this.slideshowID).append(slideNode);
    }

    /**
     * Lance des différents écouteurs d'évenements
     * @param keyboardControls {Boolean} - Si true, alors le controle au clavier est activé.
     */
    startEventsListener(keyboardControls = true){
        if(keyboardControls)
            this.addKeyboardsControlsListener();
        this.addButtonControlsListener();

    }

    /**
     *  Ajoute les écouteurs d'évenements au clavier
     */
    addKeyboardsControlsListener(){
        /*NB : Le transfert du this n'est pas nécessaire avec les fonctions fléchées*/
        $(document).on('keydown', (e)=>{
            if (e.keyCode === 39 || e.keyCode === 37) {
                if (e.keyCode === 39) {
                    this.showNext();
                } else if (e.keyCode === 37) {
                    this.showPrevious();
                }
            }
        });
    }

    /**
     *  Ajoute les écouteurs d'évenements aux bouttons
     */
    addButtonControlsListener()
    {
        $(this.slideshowID+' .slideshow-controls.next').on('click', ()=> this.showNext());
        $(this.slideshowID+' .slideshow-controls.prev').on('click', ()=> this.showPrevious());
    }

    /*--- Getter / Setter ---*/
    /**
     * set containerID() - Défini l'id du container html à utiliser pour la
     * création du diaporama.
     * Lève une erreur si le container n'existe pas.
     * @param id - Nom du container
     */
    set containerID(id) {
        if ($(id).length > 0)
            this.slideshowID = id;
        else {
            throw new Error('SLIDESHOW ERROR: \n ' + id + ' is an unknow DOM ID | Slideshow need a container to be displayed');
        }
    }
}
