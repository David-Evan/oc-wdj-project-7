/**
 * Manage, display and stop animation
 */
export class EffectManager{

    initProperties(config){
        /**
         * This is the starting section status
         */
        this.standInfoSectionStatus = 'open';
        this.standDetailSectionStatus = 'close';

        /**
         * Elements identifier collection to manage. When you add it in config, remember to add "#"
         * @type {{mapID: (*|string), standInfoSectionID: (*|string), standInfoControlButtonID: (*|string), standInfoControlButtonGlyphID: (*|string)}}
         */
        this.idCollection = {
                                map :                         config && config.map || '#mapSection',
                                standInfoSection :            config && config.standInfoSection || '#standInfoSection',
                                standInfoControlButton :      config && config.standInfoControlButton || '#standInfoControlButton',
                                standInfoControlButtonGlyph : config && config.standInfoControlButtonGlyph || '#standInfoControlButtonGlyph',
                                slideshowSection :            config && config.slideshowSection || '#slideshowSection',
                                slideshowOpenButton:          config && config.slideshowOpenButton || '#slideshowOpenButton',
                                slideshowCloseButton:         config && config.slideshowCloseButton || '#slideshowCloseButton',
                                slideshowOverlay:             config && config.slideshowOverlay || '#slideshowOverlay',
                                standPanelWelcome:            config && config.standPanelWelcome || '#standPanelWelcome',
                                statsSection:                 config && config.statsSection || '#statsSection',
                                standDetailSection:           config && config.standDetailSection || '#standDetailSection',
        };

        this.mapWidth = $(this.idCollection.map).width(); // The map width it necessary to be determinate at the last moment (when close the control panel) 'cause it can change when resizing window
        this.standInfoSectionWidth = $(this.idCollection.standInfoSection).width(); // Same as previous
    }

    constructor(config = false, lazyStarting = true) {
        this.initProperties(config);
        this.checkConfigValidity();

        if(lazyStarting){
            this.addAllEffect();
        }
    }

    checkConfigValidity(){
        for(let id in this.idCollection){

            let idValue = this.idCollection[id];

            if($(idValue).length !== 1)
            {
                console.log('L\'élément : '+idValue+ ' est présent '+ $(idValue).length +'fois');
                if($(idValue).length < 1)
                    throw new Error('EffectManager : L\'élément <strong>"'+idValue+'"</strong> est enregistré dans la configuration mais n\'apparaît pas dans la structure de la page.' +
                        '<br>(JSON Key : '+id+')');
                else
                    throw new Error('EffectManager : Il existe plusieurs instance de l\'élément <strong>"'+idValue+'"</strong>. ' +
                        '<br>(JSON Key : '+id+')');
            }
        }
    }

    addAllEffect(){
        this.addStandInfoPanelEffect();
        this.addSlideshowEffect();
    }

    addSlideshowEffect(){
        $(this.idCollection.slideshowOpenButton).on('click', ()=>{
            this.showSlideshowSection();
        });

        $(this.idCollection.slideshowCloseButton).on('click', ()=>{
            this.hideSlideshowSection();
        })
    }

    addStandInfoPanelEffect(){
        $(this.idCollection.standInfoControlButton).on('click',
            ()=> {
                if(this.standInfoSectionStatus === 'open') {
                    this.hideStandInfoSection();
                }
                else
                    this.showStandInfoSection();
            });
    }

    hideStatsSection(){
        $(this.idCollection.statsSection).css({transitionDuration: '0.5s', transform: 'translateX(-'+this.standInfoSectionWidth+'px)'})
        $(this.idCollection.statsSection).fadeOut(500);
    }

    hideStandPanelWelcome(){
        $(this.idCollection.standPanelWelcome).css({transitionDuration: '0.5s', transform: 'translateX(-'+this.standInfoSectionWidth+'px)'});
        $(this.idCollection.statsSection).fadeOut(500);
    }

    showStandDetailSection(){
        if(this.standDetailSectionStatus === 'close'){
            // is first stand detail opening
            this.hideStandPanelWelcome();
            this.hideStatsSection();
            setTimeout(()=>
                $(this.idCollection.standDetailSection).css({position:'static', transitionDuration: '0.5s', transform: 'translateX(0px)'}), 450);
        }
        else {

            this.standInfoSectionStatus = 'open';
        }

    }

    showSlideshowSection(){
        $(this.idCollection.slideshowOverlay).fadeIn('500', ()=>{
            $(this.idCollection.slideshowSection).slideToggle('slow');
        });
    }

    hideSlideshowSection(){
        $(this.idCollection.slideshowSection).slideToggle('slow', ()=>{
        $(this.idCollection.slideshowOverlay).fadeOut('500');});
    }

    hideStandInfoSection(){
        if(this.standInfoSectionStatus === 'open')
        {
            this.mapWidth = $(this.idCollection.map).width();
            this.standInfoSectionWidth = $(this.idCollection.standInfoSection).width();

            $(this.idCollection.standInfoSection).animate({left: '-'+this.standInfoSectionWidth+'px'}, 700);
            $(this.idCollection.map).animate({width: '100%'}, 700);
            $(this.idCollection.standInfoControlButtonGlyph).css({transform: 'rotate(180deg)'});
            this.standInfoSectionStatus = 'close';
        }
    }

    showStandInfoSection(){
        if(this.standInfoSectionStatus === 'close')
        {
            $(this.idCollection.standInfoSection).animate({left: '0px'}, 700);
            $(this.idCollection.map).animate({width: this.mapWidth}, 700);
            $(this.idCollection.standInfoControlButtonGlyph).css({transform: 'rotate(0deg)'});
            this.standInfoSectionStatus = 'open';
        }
    }
}