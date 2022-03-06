//Mettre le code JavaScript lié à la page photographer.html
import Lightbox from "../factories/Lightbox.js";
import OnePhotographer from "../factories/OnePhotographer.js";

// eslint-disable-next-line no-unused-vars
let photographer;
let lightbox;

function init() {
    photographer = new OnePhotographer();
    lightbox = new Lightbox();
}

init();