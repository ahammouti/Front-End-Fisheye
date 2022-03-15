export default class OnePhotographer {
    constructor() {
        // init du tableau de fetch
        this.arrayPhotographers, this.arrayMedia, this.newArrMedia = [];
        this.photographer = "";
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
        let filterMedia = [];
        if (type == "popularite") {
            this.newArrMedia.sort((a, b) => b.likes - a.likes);
            filterMedia.push(this.newArrMedia);
            this.displayDataGallery(filterMedia[0]);
        }
        else if (type == "date") {
            this.newArrMedia.sort((a, b) => {
                let da = new Date(a.date),
                    db = new Date(b.date);
                return db - da;
            });
            filterMedia.push(this.newArrMedia);
            this.displayDataGallery(filterMedia[0]);
        }
        else if (type == "Titre") {
            this.newArrMedia.sort((a, b) => {
                let t1 = a.title.toLowerCase(),
                    t2 = b.title.toLowerCase();

                if (t1 < t2) {
                    return -1;
                }
                if (t1 > t2) {
                    return 1;
                }
                return 0;
            });
            filterMedia.push(this.newArrMedia);
            this.displayDataGallery(filterMedia[0]);
        }
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
            let videosOrPicture = () => {
                if (item.video) {
                    card.addEventListener("mouseover", () => {
                        let video = document.getElementsByTagName("video")[0];
                        video.setAttribute("controls", true);
                    });
                    card.addEventListener("mouseleave", () => {
                        let video = document.getElementsByTagName("video")[0];
                        video.removeAttribute("controls");
                    });
                    return `
                        <video>
                            <source
                            src="./assets/samplePhotos/${item.photographerId}/${item.video}"
                            type="video/mp4">
                        </video>
                    `;
                }
                else {
                    return `
                        <img src="./assets/samplePhotos/${this.photographer.id}/${item.image}" alt="${item.title}" />
                    `;
                }
            };
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <a class="card__img" href="#">
                    ${videosOrPicture()}
                </a>
                <div class="card__overlay">
                    <a class="link__title" href="#">
                        <h3 class="card__title">${item.title}</h3>
                    </a>
                    <span class="card__likes">
                        <p>${item.likes}❤️</p>
                    </span>
                </div>
            `;
            sectionGallery.appendChild(card);
        });
    }
}