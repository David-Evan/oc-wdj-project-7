import * as APIKeys from './config.apikeys.js';

/**
 * Get JC Decaux API Keys
 */
export const JCDecauxAPIKey = APIKeys.JCDecauxAPIKey;
/**
 * Get Google Platform API Key
 */
export const GooglePlatformAPIKey = APIKeys.GooglePlatformAPIKey;

/**
 * Slideshow config
 * @type {{slideWidth: string, slideHeight: string, slideChangeDuration: number, nextSlideDelay: number, imageDirectory: string, enabledKeyboardControls: boolean, slidesCollection: *[]}}
 */
export const Slideshow =
{
    slideWidth: '700px',
    slideHeight: '400px',
    slideChangeDuration: 1000,
    nextSlideDelay: 3500,
    imageDirectory : './assets/images/slideshow/',
    enabledKeyboardControls: true,
    slidesCollection : [
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

/**
 * Error config
 * @type {{enabledFullDescription: boolean}}
 */
export const Error = {
    enabledFullDescription : true,
};

/**
 * Effect manager config
 * @type {{}}
 */
export const EffectManager = {
};

export const Stands= {
    contract: "Lyon",
    API_GetAllsStandsURL : 'https://api.jcdecaux.com/vls/v1/stations?contract={contract_name}&apiKey={api_key}',
};

/**
 * Google map config
 * @type {{GooglePlatformAPIKey: *, mapStartPosition: {lat: number, lng: number}, mapZoom: number, mapStyle: *[]}}
 */
export const GoogleMap = {
    GooglePlatformAPIKey:  APIKeys.GooglePlatformAPIKey,

    mapStartPosition : {lat: 45.76, lng: 4.84},
    mapZoom: 13,
    mapStyle: [
        {
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f5f5f5"
                }
            ]
        },
        {
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#616161"
                }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#f5f5f5"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#bdbdbd"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#eeeeee"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#e5e5e5"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#9e9e9e"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dadada"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#616161"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#9e9e9e"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#e5e5e5"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#eeeeee"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#abcdd4"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        }
    ],
};