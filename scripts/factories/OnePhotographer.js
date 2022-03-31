"use strict";
export default class OnePhotographer {
    constructor() {
        // init du tableau de fetch
        this.filterSelect = document.getElementById("sort");
        this.divTotalLikes = document.getElementById("js-totalLike");
        this.divPrice = document.getElementById("js-price");
        this.lightbox = document.getElementsByClassName("lightbox")[0];
        this.closeLightboxBtn = document.getElementsByClassName("js-closeLightbox")[0];
        this.imgLightbox = document.getElementById("js-imgLightbox");
        this.divImgVideoLightbox = document.getElementsByClassName("js-divImgVideoLightbox")[0];
        this.lightboxTitle = document.getElementsByClassName("js-lightboxTitle")[0];
        this.nextBtnLightbox = document.getElementsByClassName("js-nextBtnLightbox")[0];
        this.prevBtnLightbox = document.getElementsByClassName("js-prevBtnLightbox")[0];
        this.video = document.getElementsByClassName("js-video")[1];

        this.arrayPhotographers, this.arrayMedia, this.newArrMedia = [];
        this.photographer = "";

        this.totalOfLikes = 0;
        this.parseTotal = 0;

        this.lightboxElement = [];
        this.indexOfImgLightbox = 0;
        this.id = "";

        const urlParams = new URLSearchParams(window.location.search);
        this.idPhotographer = urlParams.get("id");
        this.iDirection = "";


        // feinte
        this.getPhotographers = (e) => this._getPhotographers(e);
        this.getMedias = () => this._getMedias();
        this.getFilterType = (e) => this._getFilterType(e);
        this.likePhoto = (e) => this._likePhoto(e);
        this.openLightbox = (e) => this._openLightbox(e);
        this.closeLightbox = (e) => this._closeLightbox(e);
        this.handleNavigateLightbox = (e) => this._handleNavigateLightbox(e);

        this.onKeyUp = this.onKeyUp.bind(this);
        document.addEventListener("keyup", this.onKeyUp);

        this.bindEvent();
        this.getPhotographers();
    }

    bindEvent() {
        this.filterSelect.addEventListener("change", this.getFilterType);
        if (this.closeLightboxBtn) {
            this.closeLightboxBtn.addEventListener("click", this.closeLightbox);
        }
        if (this.nextBtnLightbox) {
            this.nextBtnLightbox.addEventListener("click", this.handleNavigateLightbox);
        }
        if (this.nextBtnLightbox) {
            this.prevBtnLightbox.addEventListener("click", this.handleNavigateLightbox);
        }
    }

    /**
     * 
     * @param {KeyboardEvent} e 
     * Fermer la lightbox avec Echap
     */
    onKeyUp(e) {
        if (e.key === "Escape") {
            this.closeLightbox(e);
        }
    }

    _handleNavigateLightbox(e) {
        e.preventDefault();
        let direction = e.target.dataset.direction;
        if (direction == "next") {
            this.iDirection = 1;
            if (this.indexOfImgLightbox == this.newArrMedia.length - 1) {
                this.indexOfImgLightbox = -1;
            }
        }
        else if (direction == "prev") {
            this.iDirection = (-1);
            if (this.indexOfImgLightbox == 0) {
                this.indexOfImgLightbox = this.newArrMedia.length;
            }
        }
        this.divImgVideoLightbox.innerHTML = "";
        this.divImgVideoLightbox.innerHTML = `${this.videosOrPicture(this.newArrMedia[this.indexOfImgLightbox + this.iDirection])}`;
        this.lightboxTitle.textContent = this.newArrMedia[this.indexOfImgLightbox + this.iDirection].title;
        this.handleControlsVideo(this.newArrMedia, this.indexOfImgLightbox + this.iDirection);
        this.indexOfImgLightbox += this.iDirection;
    }

    findIndex(e, array) {
        this.id = e.target.getAttribute("id");
        const lightboxTitleValue = e.currentTarget.parentNode.children[1].children[0].innerText;
        const image = new Image();
        this.lightboxTitle.textContent = lightboxTitleValue;
        this.divImgVideoLightbox.innerHTML = "<div class='lightbox__loader'></div>";
        array.findIndex(element => {
            const loader = document.getElementsByClassName("lightbox__loader")[0];
            element.id === this.id;
            // image.onload = () => {
            //     // loader.parentElement.removeChild(loader);
            // };
            if (element.id == this.id) {
                this.indexOfImgLightbox = array.indexOf(element);
                console.log(array[this.indexOfImgLightbox]);
                console.log(this.indexOfImgLightbox);
            }
            this.divImgVideoLightbox.innerHTML = `${this.videosOrPicture(array[this.indexOfImgLightbox])}`;
            this.handleControlsVideo(array, this.indexOfImgLightbox);
            // image.src = `./assets/samplePhotos/${this.photographer.id}/${element.image}`;
        });
    }

    handleControlsVideo(array, index) {
        if (array[index].video) {
            const video = document.getElementsByClassName("js-video")[1];
            video.setAttribute("controls", true);
        }
    }

    _openLightbox(e) {
        this.lightbox.classList.remove("hide");
        this.lightbox.classList.add("show");
        this.findIndex(e, this.newArrMedia);
        // this.handleNavigateLightbox(this.indexOfImgLightbox);
    }
    _closeLightbox(e) {
        e.preventDefault;
        const divRemoveLightbox = document.getElementsByClassName("lightbox__container")[0];
        this.lightbox.classList.add("hide");
        this.lightbox.classList.remove("show");
        // if (this.lightbox.classList.contains("hide")) {
        //     this.lightbox.removeChild(divRemoveLightbox);
        // }
        // else {
        //     return "";
        // }
        document.removeEventListener("keyup", this.onKeyUp);
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

    filterArrLightbox() {
        console.log(this.lightboxElement);
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

    videosOrPicture = (item) => {
        if (item.video) {
            const divVideo = `
                <video data-controls="false" class="js-video" id="${item.id}">
                <source
                src="./assets/samplePhotos/${item.photographerId}/${item.video}"
                type="video/mp4">
                </video>
            `;
            return divVideo;
        }
        else {
            return `
                <img src="./assets/samplePhotos/${this.photographer.id}/${item.image}" alt="${item.title}" id="${item.id}" />
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