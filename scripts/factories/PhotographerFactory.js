export default class PhotographerFactory {

    constructor() {
        this.boutton = document.getElementsByClassName("js-btnTest")[0];

        // init du tableau de fetch
        this.arrayPhotographers = [];

        // feinte
        this.getPhotographers = () => this._getPhotographers();
        this.filterData = (e) => this._filterData(e);

        this.getPhotographers();
        this.bindEvent();
    }

    async _getPhotographers() {
        const response = await fetch("../../data/photographers.json");
        console.log(response);
        if (response.status === 200) {
            const res = await response.json();
            console.log("res 1", res);

            // enregistrement du tableau fetch
            this.arrayPhotographers = res.photographers;
            this.displayData(this.arrayPhotographers);
        }
    }

    displayData(photographers) {
        const photographersSection = document.querySelector(".photographer_section");
        photographersSection.innerHTML = "";

        photographers.forEach((photographer) => {
            const article = document.createElement("article");
            this._picture = `assets/samplePhotos/Photographers_ID_Photos/${photographer.portrait}`;
            article.innerHTML = `
                <a href="./photographer.html?id=${photographer.id}" aria-label="${photographer.name}">
                    <img src=${this._picture} alt="${photographer.name}" />
                    <h2 class="name">${photographer.name}</h2>
                </a>
                <p class="location">${photographer.city}, ${photographer.country}</p>
                <p class="tagline">${photographer.tagline}</p>
                <small class="price">${photographer.price}€/jour</small>
            `;
            photographersSection.appendChild(article);
        });
    }

    _filterData() {
        // ON trie le tableau photographers
        // let newTab = "C'est le tableau qu'on va trier";

        // this.displayData(newTab);
        console.log("boutton");
    }

    bindEvent() {
        // for (const link of this.links) {
        //     link.addEventListener("click", this.getPanel);
        // }

        if (this.boutton) {
            this.boutton.addEventListener("click", this.filterData);
        }

    }
}