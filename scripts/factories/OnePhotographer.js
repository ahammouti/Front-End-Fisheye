export default class OnePhotographer {
    constructor() {
        // init du tableau de fetch
        this.filterSelect = document.getElementById("sort");
        this.divTotalLikes = document.getElementById("js-totalLike");
        this.divPrice = document.getElementById("js-price");
        this.lightbox = document.getElementsByClassName("lightbox")[0];
        this.closeLightboxBtn = document.getElementsByClassName("js-closeLightbox")[0];
        this.arrayPhotographers, this.arrayMedia, this.newArrMedia = [];
        this.photographer = "";
        this.totalOfLikes = 0;
        this.parseTotal = 0;


        const urlParams = new URLSearchParams(window.location.search);
        this.idPhotographer = urlParams.get("id");

        // feinte
        this.getPhotographers = (e) => this._getPhotographers(e);
        this.getMedias = () => this._getMedias();
        this.getFilterType = (e) => this._getFilterType(e);
        this.likePhoto = (e) => this._likePhoto(e);
        this.openLightbox = (e) => this._openLightbox(e);
        this.closeLightbox = (e) => this._closeLightbox(e);

        this.bindEvent();
        this.getPhotographers();
    }

    bindEvent() {
        console.log(this.closeLightboxBtn);
        this.filterSelect.addEventListener("change", this.getFilterType);

        if (this.closeLightboxBtn) {
            this.closeLightboxBtn.addEventListener("click", this._closeLightbox());
        }
    }

    _openLightbox(e) {
        this.lightbox.classList.remove("hide");
        this.lightbox.classList.add("show");
    }
    _closeLightbox(e) {
        this.lightbox.classList.add("hide");
        this.lightbox.classList.remove("show");
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
        for (let i = 0; i < this.newArrMedia.length; i++) {
            const element = this.newArrMedia[i];
            this.totalOfLikes += element.likes;
        }
        this.divTotalLikes.textContent = this.totalOfLikes;
        this.parseTotal = parseInt(this.divTotalLikes.textContent);
        this.divPrice.textContent = this.photographer.price + "€ / jour";

        this.displayDataGallery(this.newArrMedia);
    }

    filterTypeMedia(type) {
        let filterMedia = [];
        if (type == "popularite") {
            this.newArrMedia.sort((a, b) => b.likes - a.likes);
            filterMedia.push(this.newArrMedia);
            this.divTotalLikes.textContent = this.totalOfLikes;
            this.parseTotal = parseInt(this.divTotalLikes.textContent);

            this.displayDataGallery(filterMedia[0]);
        }
        else if (type == "date") {
            this.newArrMedia.sort((a, b) => {
                let da = new Date(a.date),
                    db = new Date(b.date);
                return db - da;
            });
            filterMedia.push(this.newArrMedia);

            this.divTotalLikes.textContent = this.totalOfLikes;
            this.parseTotal = parseInt(this.divTotalLikes.textContent);
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

            this.divTotalLikes.textContent = this.totalOfLikes;
            this.parseTotal = parseInt(this.divTotalLikes.textContent);
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

    videosOrPicture = (item, card) => {
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

    displayDataGallery(tabl) {
        const sectionGallery = document.getElementsByClassName("gallery")[0];
        sectionGallery.innerHTML = "";

        tabl.map(item => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <div class="card__img js-openLightbox">
                    ${this.videosOrPicture(item, card)}
                </div>
                <div class="card__overlay">
                    <h3 class="card__title">${item.title}</h3>
                    <div class="card__likes">
                        <div class="js-photoLike" data-isliked=false>
                            <p class="like">${item.likes}</p>
                            <div class="heart">
                                <i class="far fa-heart"></i>
                                <span class="js-heartSolid">
                                    <i class="fas fa-heart"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            sectionGallery.appendChild(card);

        });
        const likePhotos = document.getElementsByClassName("js-photoLike");

        for (const likePhoto of likePhotos) {
            likePhoto.addEventListener("click", this.likePhoto);
        }

        const lightboxOpenButton = document.getElementsByClassName("js-openLightbox");

        for (const button of lightboxOpenButton) {
            button.addEventListener("click", this.openLightbox);
        }
    }

    _likePhoto(e) {
        const jsHeartSolid = e.currentTarget.getElementsByClassName("js-heartSolid")[0];
        const container = e.currentTarget.getElementsByClassName("like")[0];
        const numberLike = parseInt(container.textContent);
        const isLiked = e.currentTarget.dataset.isliked;

        if (isLiked == "false") {
            const newLike = numberLike + 1;
            container.textContent = newLike;
            e.currentTarget.setAttribute("data-isliked", true);
            this.parseTotal += 1;
            this.divTotalLikes.textContent = this.parseTotal;
            jsHeartSolid.classList.add("show");
        }
        else {
            const newLike = numberLike - 1;
            container.textContent = newLike;
            e.currentTarget.setAttribute("data-isliked", false);
            this.parseTotal -= 1;
            this.divTotalLikes.textContent = this.parseTotal;
            jsHeartSolid.classList.remove("show");
        }
    }
}