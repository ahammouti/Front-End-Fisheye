//@ts-check
const PhotographerFactory = data => {

    const { name, portrait } = data;

    /**
     * Dynamic path of the picture  
     * @type {string}
     */
    const picture = `assets/photographers/${portrait}`;

    const getUserCardDOM = () => {
        const article = document.createElement("article");

        const link = document.createElement("a");
        link.setAttribute("href", "");

        const img = document.createElement("img");
        img.setAttribute("src", picture);

        const h2 = document.createElement("h2");
        h2.textContent = name;
        article.appendChild(link);
        link.appendChild(img);
        link.appendChild(h2);

        return (article);
    };
    return { name, picture, getUserCardDOM };
};
export default PhotographerFactory;