import * as Config from './modules/config.js';

export class StandsManager{

    initProperties(){
        this.standsCollection = [];
    }

    constructor()
    {
        this.initProperties();
        this.loadStands();
    }

    loadStands() {
        let APIurl = Config.Stands.API_GetAllsStandsURL.replace('{contract_name}', Config.Stands.contract)
            .replace('{api_key}', Config.JCDecauxAPIKey);

        $.ajax({
            url: APIurl,
            dataType: 'json',
            async:false
            }).done((data)=>{
                this.standsCollection = data;
        });
    }

    getAllStands(){
        return this.standsCollection;
    }
}