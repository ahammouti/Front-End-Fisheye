export default class PhotographerFactory {
    constructor() {
        // init du tableau de fetch
        this.arrayPhotographers = [];

        // feinte
        this.getPhotographers = () => this._getPhotographers();

        // Appel des méthodes
        this.getPhotographers();
    }

    // Méthodes
    async _getPhotographers() {
        const response = await fetch("../../data/photographers.json");
        if (response.status === 200) {
            const res = await response.json();

            // enregistrement du tableau fetch
            this.arrayPhotographers = res.photographers;

            this.displayData(this.arrayPhotographers);
        }
    }

    // Home page display data
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
}