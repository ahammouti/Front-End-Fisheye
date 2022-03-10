export default class OnePhotographer {
    constructor() {
        // init du tableau de fetch
        this.arrayPhotographers = [];
        this.photographer = "";
        this.arrayMedia = [];
        this.newArrMedia = [];
        this.filterSelect = document.getElementById("sort");

        const urlParams = new URLSearchParams(window.location.search);
        this.idPhotographer = urlParams.get("id");

        // feinte
        this.getPhotographers = (e) => this._getPhotographers(e);
        this.getMedias = () => this._getMedias();
        this.getFilterType = (e) => this._getFilterType(e);

        this.bindEvent();
        this.getPhotographers();

    }

    bindEvent() {
        this.filterSelect.addEventListener("change", this.getFilterType);
    }

    _getFilterType(e) {
        let type = e.target.value;
        this.filterTypeMedia(type);
    }

    async _getPhotographers() {
        const response = await fetch("../../data/photographers.json");
        if (response.status === 200) {
            const res = await response.json();

            // enregistrement du tableau fetch
            this.arrayPhotographers = res;

            this.filterPhotographer();
            this.filterMedia();
        }
    }

    // filtrage du tableau this.arrayPhotographer
    filterPhotographer() {
        this.arrayPhotographers.photographers.filter(e => {
            if (this.idPhotographer == e.id) {
                this.photographer = e;
                this.displayDataPagePhotographer(this.photographer);
            }
        });
    }

    async filterMedia() {
        this.arrayPhotographers.media.filter(e => {

            if (this.idPhotographer == e.photographerId) {
                this.arrayMedia = e;
                this.newArrMedia.push(this.arrayMedia);
                this.newArrMedia.sort((a, b) => b.likes - a.likes);
            }
        });
        await this.displayDataGallery(this.newArrMedia);
    }

    filterTypeMedia(type) {
        // creer un new tableau
        let filterMedia = [];
        if (type == "popularite") {
            // filtrer popularite
            this.newArrMedia.sort((a, b) => {
                return b.likes - a.likes;
            });

            // trier tableau et remplir
            // this.displayDataGallery(filterMedia);
            filterMedia.push(this.newArrMedia);
            this.displayDataGallery(filterMedia[0]);
        }
        else if (type == "date") {
            this.displayDataGallery(filterMedia);
            // filtrer titre
            // trier tableau et remplir
        }
        else if (type == "Titre") {

            // trier tableau et remplir
        }

        // si images ne s'affichent pas utiliser await async ligne 65

        console.log("type", type);
    }

    displayDataPagePhotographer(photographer) {
        const photographHeader = document.querySelector(".photograph-header");
        photographHeader.innerHTML = "";

        const section = document.createElement("section");
        section.classList.add("wrap-header");

        section.innerHTML = `
        <div class="left">
        <h2>${photographer.name}</h2>
        <p class="location">${photographer.city}, ${photographer.country}</p>
        <p class="tagline">${photographer.tagline}</p>
        </div>
        <button class="contact_button" onclick="displayModal()">Contactez-moi</button>
        <img src="assets/samplePhotos/Photographers_ID_Photos/${photographer.portrait}" alt="${photographer.name}" />
        `;
        photographHeader.appendChild(section);
    }

    displayDataGallery(tabl) {
        const sectionGallery = document.getElementsByClassName("gallery")[0];
        sectionGallery.innerHTML = "";


        tabl.map(item => {
            console.log(item);
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <img src="../../assets/samplePhotos/${this.photographer.id}/${item.image}" />
                <h2>${item.title} + ${item.likes}</h2>
            `;
            sectionGallery.appendChild(card);

        });
    }
}