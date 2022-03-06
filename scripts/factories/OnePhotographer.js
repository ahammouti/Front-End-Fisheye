export default class OnePhotographer {
    constructor() {
        // init du tableau de fetch
        this.arrayPhotographers = [];
        this.photographer = "";

        const urlParams = new URLSearchParams(window.location.search);
        this.idPhotographer = urlParams.get("id");

        // feinte
        this.getPhotographers = () => this._getPhotographers();
        this.getPhotographers();
    }

    async _getPhotographers() {
        const response = await fetch("../../data/photographers.json");
        if (response.status === 200) {
            const res = await response.json();

            // enregistrement du tableau fetch
            this.arrayPhotographers = res.photographers;

            this.filterPhotographer();
        }
    }

    filterPhotographer() {
        this.arrayPhotographers.filter(e => {
            console.log(e.id);
            if (this.idPhotographer == e.id) {
                console.log("true");
                this.photographer = e;
                this.displayDataPagePhotographer(this.photographer);
            }
            else {
                console.log("error");
            }
        });
        console.log(this.photographer);


        // on filtre le tableau this.arrayPhotographer
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
}



// 1 : recup id
// 2 : Fetch les datas
// 3 : filtrer le photographe avec son id


//  