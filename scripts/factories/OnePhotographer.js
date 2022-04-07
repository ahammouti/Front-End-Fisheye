"use strict";
export default class OnePhotographer {
    constructor() {
        // init du tableau de fetch
        this.filterSelect = document.getElementById("sort");
        this.divTotalLikes = document.getElementById("js-totalLike");
        this.divPrice = document.getElementById("js-price");
        this.lightbox = document.getElementsByClassName("lightbox")[0];
        this.cards = document.getElementsByClassName("js-card");
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
        this.handleNavigateLightbox = (e, direction) => this._handleNavigateLightbox(e, direction);

        this.onKeyUp = this.onKeyUp.bind(this);
        this.onKeyUpEnter = (e) => this._onKeyUpEnter(e);

        this.bindEvent();

        this.getPhotographers();
    }

    bindEvent() {
        this.filterSelect.addEventListener("change", this.getFilterType);

        // Evenements liés à la navigation dans la lightbox
        if (this.closeLightboxBtn) {
            this.closeLightboxBtn.addEventListener("click", this.closeLightbox);
        }
        if (this.nextBtnLightbox) {
            this.nextBtnLightbox.addEventListener("click", this.handleNavigateLightbox);
        }
        if (this.nextBtnLightbox) {
            this.prevBtnLightbox.addEventListener("click", this.handleNavigateLightbox);
        }

        window.addEventListener("keyup", this.onKeyUpEnter);

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
        else if (e.key === "ArrowLeft") {
            let callBack = (callback) => {
                this.iDirection = -1;
                if (this.indexOfImgLightbox === 0) {
                    this.indexOfImgLightbox = this.newArrMedia.length;
                }
                callback(e, "prev");
            };
            callBack(this.handleNavigateLightbox);
        }
        else if (e.key === "ArrowRight") {
            let callBack = (callback) => {
                this.iDirection = 1;
                if (this.indexOfImgLightbox === this.newArrMedia.length - 1) {
                    this.indexOfImgLightbox = -1;
                }
                callback(e, "next");
            };
            callBack(this.handleNavigateLightbox);
        }

        // 
        const focusableElements = "button, [tabindex]:not([tabindex='-1'])";
        const modal = document.querySelector("#modal-lightbox");

        const firstFocusableElement = modal.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
        const focusableContent = modal.querySelectorAll(focusableElements);

        let isTabPressed = e.key === "Tab" || e.keyCode === 9;

        if (!isTabPressed) {
            return;
        }

        if (document.activeElement === firstFocusableElement) {
            e.preventDefault();
            focusableContent[0].focus(); // add focus for the last focusable element
        }
        else if (document.activeElement === focusableContent[1]) { // if focused has reached to last focusable element then focus first focusable element after pressing tab
            e.preventDefault();
            focusableContent[1].focus();
        }
        else if (document.activeElement === focusableContent[2]) {
            e.preventDefault;
            focusableContent[2].focus();

        }
        else {
            e.preventDefault;
            focusableContent[0].focus();
        }
    }

    _handleNavigateLightbox(e, direction) {
        e.preventDefault();
        this.direction = e.target.dataset.direction;
        direction = this.direction;
        if (direction === "next") {
            this.iDirection = 1;
            if (this.indexOfImgLightbox === this.newArrMedia.length - 1) {
                this.indexOfImgLightbox = -1;
            }
        }
        else if (direction === "prev") {
            this.iDirection = (-1);
            if (this.indexOfImgLightbox === 0) {
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
        this.divImgVideoLightbox.innerHTML = "<div class='lightbox__loader'></div>";
        array.findIndex(element => {
            const loader = document.getElementsByClassName("lightbox__loader")[0];
            element.id === this.id;
            if (element.id == this.id) {
                this.indexOfImgLightbox = array.indexOf(element);
                this.lightboxTitle.textContent = element.title;
            }
            this.divImgVideoLightbox.innerHTML = `${this.videosOrPicture(array[this.indexOfImgLightbox])}`;
            this.handleControlsVideo(array, this.indexOfImgLightbox);
        });
    }

    handleControlsVideo(array, index) {
        if (array[index].video) {
            const video = document.getElementsByClassName("js-video")[1];
            video.setAttribute("controls", true);
        }
    }

    _openLightbox(e) {
        this.lightbox.style.display = "flex";
        this.lightbox.classList.remove("hide");
        this.lightbox.classList.add("show");
        this.findIndex(e, this.newArrMedia);
        document.addEventListener("keyup", this.onKeyUp);
        window.removeEventListener("keyup", this.onKeyUpEnter);
    }

    _onKeyUpEnter(e) {
        for (const card of this.cards) {
            if (document.activeElement === card) {
                console.log(document.activeElement);
                if (e.key === "Enter") {
                    this.openLightbox(e);
                }
            }
        }
    }

    /**
     * @param {MouseEvent|KeyboardEvent} e 
     * Ferme la lightbox
     */
    _closeLightbox(e) {
        e.preventDefault;
        const divRemoveLightbox = document.getElementsByClassName("lightbox__container")[0];
        this.lightbox.classList.add("hide");
        setTimeout(() => {
            this.lightbox.style.display = "none";
        }, 1000);
        this.lightbox.classList.remove("show");
        document.removeEventListener("keyup", this.onKeyUp);
        window.addEventListener("keyup", this.onKeyUpEnter);
    }

    _getFilterType(e) {
        let type = e.target.value;
        this.filterTypeMedia(type);
    }

    async _getPhotographers() {
        const response = await fetch("data/photographers.json");
        if (response.status === 200) {
            const res = await response.json();
            this.arrayPhotographers = res; // enregistrement du tableau fetch

            this.filterPhotographer();
            this.filterMedia();
        }
    }

    /**
     * @function filterPhotographer()
     * Méthode qui filtre les photographe et affiche seulement le photographe qui correspond à son id url
     */
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
        const wrapHeader = document.getElementById("js-wrapHeader");
        const photographerName = document.getElementById("js-photographerName");
        const location = document.getElementById("js-location");
        const tagline = document.getElementById("js-tagline");
        const profilePicture = document.createElement("img");

        photographerName.textContent = `${photographer.name}`;
        location.textContent = `${photographer.city}, ${photographer.country}`;
        tagline.textContent = `${photographer.tagline}`;
        profilePicture.setAttribute("alt", `${photographer.name}`);
        profilePicture.src = `./assets/samplePhotos/Photographers_ID_Photos/${photographer.portrait}`;
        wrapHeader.appendChild(profilePicture);
    }

    videosOrPicture = (item) => {
        if (item.video) {
            const divVideo = `
                <video tabindex="0" aria-label="${item.title} video" data-controls="false" class="js-card js-video" id="${item.id}">
                <source
                src="./assets/samplePhotos/${item.photographerId}/${item.video}"
                type="video/mp4">
                </video>
            `;
            return divVideo;
        }
        else {
            return `
                <img tabindex="0" class="js-card" role="img" src="./assets/samplePhotos/${this.photographer.id}/${item.image}" alt="${item.title}" id="${item.id}" />
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
                        <button tabindex="0" class="js-photoLike" data-isliked=false>
                            <span class="like">${item.likes}</span>
                            <span class="heart">
                                <i class="far fa-heart"></i>
                                <span class="js-heartSolid">
                                    <i class="fas fa-heart"></i>
                                </span>
                            </span>
                        </button>
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