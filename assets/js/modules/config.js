import * as APIKeys from './config.apikeys.js';

export const JCDecauxAPIKey = APIKeys.JCDecauxAPIKey;
export const GooglePlatformAPIKey = APIKeys.GooglePlatformAPIKey;

export const Slideshow =
{
    slideWidth: '700px',
    slideHeight: '400px',
    slideChangeDuration: 1000,
    nextSlideDelay: 3500,
    imageDirectory : './assets/images/slideshow/',
    enabledKeyboardControls: true,
    slideshowData : [
        {
            imageURL: 'https://dummyimage.com/700x400/111/ff0000&text=1',
            title: 'Ceci est ma première diapo',
            textContent: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, corrupti!'
        },
        {
            imageURL: 'https://dummyimage.com/700x400/000/fff&text=2',
            title: 'Ceci est ma seconde diapo',
            textContent: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, corrupti!'
        },
        {
            imageURL: 'https://dummyimage.com/700x400/ddd/000&text=3',
            title: 'Ceci est ma 3ème diapo',
            textContent: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, corrupti!'
        },
    ],
};

export const GoogleMap = {
    GooglePlatformAPIKey:  APIKeys.GooglePlatformAPIKey
};

export const Stands= {

    contract: "Lyon",

    API_GetAllsStandsURL : 'https://api.jcdecaux.com/vls/v1/stations?contract={contract_name}&apiKey={api_key}',
};
