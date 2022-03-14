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
        const response = await fetch("data/photographers.json");
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

    filterMedia() {
        this.arrayPhotographers.media.filter(e => {

            if (this.idPhotographer == e.photographerId) {
                this.arrayMedia = e;
                this.newArrMedia.push(this.arrayMedia);
                this.newArrMedia.sort((a, b) => b.likes - a.likes);
            }
        });
        this.displayDataGallery(this.newArrMedia);
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
        const photographerName = document.getElementById("js-photographerName");
        const location = document.getElementById("js-location");
        const tagline = document.getElementById("js-tagline");
        const profilePicture = document.getElementById("js-profilePicture");

        photographerName.textContent = `${photographer.name}`;
        location.textContent = `${photographer.city}, ${photographer.country}`;
        tagline.textContent = `${photographer.tagline}`;
        profilePicture.src = `./assets/samplePhotos/Photographers_ID_Photos/${photographer.portrait}`;
        profilePicture.setAttribute("alt", `${photographer.name}`);
    }

    displayDataGallery(tabl) {
        const sectionGallery = document.getElementsByClassName("gallery")[0];
        sectionGallery.innerHTML = "";

        tabl.map(item => {
            console.log(item);
            let videosOrPicture = () => {
                if (item.video) {
                    return `
                        <video controls>
                            <source
                            src="./assets/samplePhotos/${item.photographerId}/${item.video}"
                            type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    `;
                }
                else {
                    return `
                        <img src="../../assets/samplePhotos/${this.photographer.id}/${item.image}" alt="${item.title}" />
                    `;
                }
            };
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <a href="#">
                    ${videosOrPicture()}
                </a>
                <a href="#">
                    <h2>${item.title}      ❤️${item.likes}</h2>
                </a>
            `;
            sectionGallery.appendChild(card);
        });
    }
}