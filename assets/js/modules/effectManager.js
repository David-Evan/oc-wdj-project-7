/**
 * Manage, display and stop animation
 */
export class EffectManager{

    initProperties(config){
        this.mapWidth = 0; // The map width it necessary to be determinate at the last moment (when close the control panel) 'cause it can change when resizing window
        this.standInfoSectionWidth = 0;

        /**
         * Elements identifier collection to manage. When you add it in config, remember to add "#"
         * @type {{mapID: (*|string), standInfoSectionID: (*|string), standInfoControlButtonID: (*|string), standInfoControlButtonGlyphID: (*|string)}}
         */
        this.idCollection = {
                                mapID :                         config && config.mapID || '#map',
                                standInfoSectionID :            config && config.standInfoSectionID || '#standInfoSection',
                                standInfoControlButtonID :      config && config.standInfoControlButtonID || '#standInfoControlButton',
                                standInfoControlButtonGlyphID : config && config.standInfoControlButtonGlyphID || '#standInfoControlButtonGlyph',
        };
    }

    constructor(config = false, lazyStarting = true)
    {
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
    }

    addStandInfoPanelEffect(){

        $(this.idCollection.standInfoControlButtonID).on( 'click',
            ()=> {
                if($(this.idCollection.standInfoControlButtonID).data('state') == 'open') {
                    this.mapWidth = $(this.idCollection.mapID).width();
                    this.standInfoSectionWidth = $(this.idCollection.standInfoSectionID).width();
                    this.hideStandInfoSection();
                }
                else
                    this.showStandInfoSection();
            });
    }

    hideStandInfoSection(){
        $(this.idCollection.standInfoSectionID).animate({left: '-'+this.standInfoSectionWidth+'px'}, 700);
        $(this.idCollection.mapID).animate({width: '100%'}, 700);
        $(this.idCollection.standInfoControlButtonGlyphID).css({transform: 'rotate(180deg)'});
        $(this.idCollection.standInfoControlButtonID).data('state', 'close');
    }

    showStandInfoSection(){
        $(this.idCollection.standInfoSectionID).animate({left: '0px'}, 700);
        $(this.idCollection.mapID).animate({width: this.mapWidth}, 700);
        $(this.idCollection.standInfoControlButtonGlyphID).css({transform: 'rotate(0deg)'});
        $(this.idCollection.standInfoControlButtonID).data('state', 'open');
    }
}