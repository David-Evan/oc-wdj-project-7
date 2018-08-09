import * as Config from './modules/config.js';
import {Slideshow} from './modules/slideshow.js';
import {SignaturePad} from './modules/signaturePad.js';

/* Create Slideshow
/* let slideshow = new Slideshow('slideshowSection',
                               Config.Slideshow.slideshowData,
                               Config.Slideshow);

/* Load Sign*/
/*
let signaturePad = new SignaturePad('signatureContainer');
*/

import {GoogleMap} from './googleMap.js';

let map = new GoogleMap(Config.GoogleMap);