import '../assets/sass/main.scss'


window.addEventListener("load", () => {
    loadMapView();
});




const app = document.querySelector(".app");
const header = app.querySelector(".header");
const main = app.querySelector(".main");
const overlay = app.querySelector(".overlay");
const blackOverlay = app.querySelector(".black_overlay");
let view;



/**
 * 
 */
const loadMapView = () => {
    // init procedures
    overlay.classList.remove("opened");
    blackOverlay.classList.remove("opened");
    location.hash = "map";
    view = "map";


    //render
    renderMapView();


    //events
    eventsMapView();
};

const renderMapView = () => {
    // header...
    main.innerHTML = `
        <h3>Oye aquí estoy en el mapa!!</h3>
        <button class="goToDetail">Vete a la vista detalle</button>
    `;
    // footer...
};

const eventsMapView = () => {
    const button = main.querySelector(".goToDetail");
    button.addEventListener("click", () => {
        loadFetchView();
        setTimeout(() => {
            loadSingleView();
        }, 2000)
    });
};




/**
 * 
 */
const loadFetchView = () => {
    const spinner = document.querySelector(".spinner");
    spinner.classList.add("opened");
};
const unloadFetchView = () => {
    const spinner = document.querySelector(".spinner");
    spinner.classList.remove("opened");
};


/**
 * 
 */
const loadSingleView = () => {
    unloadFetchView();

    overlay.classList.add("opened");
    blackOverlay.classList.add("opened");

    location.hash = "single";
    overlay.innerHTML = `
        <h3>Oye estoy en la vista single</h3>
        <button class="goToMain">Vete a la vista mapa</button>
    `;

    //
    const button = overlay.querySelector(".goToMain");
    button.addEventListener("click", () => {
        loadMapView();
    });
};