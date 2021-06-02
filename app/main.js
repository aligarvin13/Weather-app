import '../assets/sass/main.scss'
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWxpZ2FydmluMDAiLCJhIjoiY2tvanA1cTRyMDBrMjJzbnBqODE2M2VnMiJ9.9h7sBPbe-riugAZFgGUoZQ';


window.addEventListener("load", () => {
    loadMapView();
});

let markersPositions;
let mapPosition;
let map;
let weather;

/**
 * getItem en localstorage, if ok, set markersPositions, if not, empty array and set markersPositions.
 */
const loadMarkers = () => {
    //localstorage
    const localStorageMarkers = localStorage.getItem("markers");
    if(localStorageMarkers == null) {
        markersPositions = [];
    } else {
        markersPositions = JSON.parse(localStorageMarkers);
    }
}

/**
 * getItem en localstorage, if ok, set mapPosition, if not, empty array and set mapPosition.
 */
const loadMapInfo = () => {
    //localStorage
    const localStoragePosition = localStorage.getItem("map-info");
    if(localStoragePosition == null) {
        mapPosition = {
            center: [-3,40],
            zoom: 8
        };
    } else {
        mapPosition = JSON.parse(localStoragePosition);
    }
}


/**
 * update la URL map, update la variable view
 */
const loadMapView = () => {
    loadMarkers();
    loadMapInfo();

    renderMapViewHeader();
    renderMapViewMain();
    renderMapViewFooter();
} 

/**
 * render innerHTML 
 */
const renderMapViewHeader = () => {
    const header = document.querySelector(".header");
    header.innerHTML = `<div class="first_title">Consulta el tiempo en un click</div>` 
}

/**
 * render innerHTML 
 */
const renderMapViewMain = () => {
    const main = document.querySelector(".main");
    main.innerHTML = `<div id="mapa"></div>`;
    renderMap();
    renderMarkers();
    initMapEvents();
}

/**
 * render innerHTML
 * init event
 */
const renderMapViewFooter = () => {
    const footer = document.querySelector(".footer");
    footer.innerHTML = 
    `<button class="first_footer">
        <span class="fa fa-crosshairs"></span>
        <span class="go_position">¿Donde estás?</span>
    </button>`;
    
    footer.addEventListener("click", () => {
        flyToLocation();   
    });  
}

/**
 * create map, set map
 */
 const renderMap = () => {
    map = new mapboxgl.Map({
        container: 'mapa',
        style: 'mapbox://styles/aligarvin00/ckpenn2iz0ffq18o0zyatd5mv',
        center: mapPosition.center,
        zoom: mapPosition.zoom
    });
};

/**
 * create markers, set markers
 */
const renderMarkers = () => {
    markersPositions.forEach(m => {
       new mapboxgl.Marker().setLngLat([m.coord.lon, m.coord.lat]).addTo(map); 
    }) 
}


/**
 * 
 */
 const flyToLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
        const lng = position.coords.longitude;
        const lat = position.coords.latitude;

        //
        map.flyTo({
            center: [lng,lat],
            zoom: 9
        })

    });
 }

/**
 * get map, and on("click")
 */
const initMapEvents = () => {  // move, click
    map.on("move", (ev) => {
        const center = ev.target.getCenter();
        const zoom = ev.target.getZoom();
        const storingObj = {
            lat: center.lat,
            lng: center.lng,
            zoom: zoom
        };
        localStorage.setItem("map-info",JSON.stringify(storingObj));
    });

    map.on("click", async(ev) => {
        loadSingleView(ev.lngLat); 
    });
}


/**
 * spinner funciona,
 * cogemos datos de la api, spinner deja de funcionar,
 * pintamos vistas
 */
const loadSingleView = async (lngLat) => {
    loadSpinner();
    await fetchData(lngLat);
    
    unloadSpinner();
    renderSingleViewHeader();
    renderSingleViewMain();
    renderSingleViewFooter();
}


const loadSpinner = () => {
    const spinner = document.querySelector(".spinner");
    spinner.classList.add("opened");
}

const unloadSpinner = () => {
    const spinner = document.querySelector(".spinner");
    spinner.classList.remove("opened");
}

/**
 * coger datos de la api
 * y los almacenamos en una variable global
 */
const fetchData = async (lngLat) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lngLat.lat}&lon=${lngLat.lng}&appid=b92eb8a2e5fe79e7ea0cfcf4ebb3d1b8&units=metric`;
    weather = await fetch(url).then(d => d.json()).then(d => d);
}

const renderSingleViewHeader = () => {
    const header = document.querySelector(".header");
    header.innerHTML = 
    `
    <div class="header_weather">
        <div class="button_container">
            <button>
                <span class="fa fa-arrow-circle-left"></span>
            </button>
        </div>
        <h2>${weather.name}</h2>
    </div>
    `;

    const buttonBack = header.querySelector("button");
    buttonBack.addEventListener("click", () => {
        loadMapView();    
    })
}

const renderSingleViewMain = () => {
    console.log(weather);
    const main = document.querySelector(".main");
    main.innerHTML = 
    `
    <div class="weather_container">
        <div class="weather_item">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30pt" height="30pt" viewBox="0 0 15 15" version="1.1">
                <g id="surface1">
                    <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 11.042969 2.871094 L 11.042969 3.402344 L 8.992188 3.402344 L 8.992188 2.871094 Z M 10.183594 4.023438 L 8.992188 4.023438 L 8.992188 4.554688 L 10.183594 4.554688 Z M 8.992188 5.707031 L 11.042969 5.707031 L 11.042969 5.179688 L 8.992188 5.179688 Z M 10.183594 6.332031 L 8.992188 6.332031 L 8.992188 6.859375 L 10.183594 6.859375 Z M 8.992188 8.015625 L 11.042969 8.015625 L 11.042969 7.484375 L 8.992188 7.484375 Z M 9.3125 11.03125 C 9.3125 12.507812 8.113281 13.707031 6.632812 13.707031 C 5.15625 13.707031 3.957031 12.507812 3.957031 11.03125 C 3.957031 10.074219 4.457031 9.203125 5.277344 8.722656 L 5.277344 2.648438 C 5.277344 1.898438 5.886719 1.292969 6.632812 1.292969 C 7.382812 1.292969 7.992188 1.898438 7.992188 2.648438 L 7.992188 8.722656 C 8.8125 9.203125 9.3125 10.070312 9.3125 11.03125 Z M 8.785156 11.03125 C 8.785156 10.21875 8.332031 9.484375 7.605469 9.113281 L 7.460938 9.039062 L 7.460938 2.648438 C 7.460938 2.191406 7.089844 1.820312 6.632812 1.820312 C 6.179688 1.820312 5.808594 2.191406 5.808594 2.648438 L 5.808594 9.039062 L 5.664062 9.113281 C 4.9375 9.484375 4.484375 10.21875 4.484375 11.03125 C 4.484375 12.214844 5.449219 13.179688 6.632812 13.179688 C 7.820312 13.179688 8.785156 12.214844 8.785156 11.03125 Z M 8.34375 11.03125 C 8.34375 11.972656 7.578125 12.738281 6.632812 12.738281 C 5.691406 12.738281 4.925781 11.972656 4.925781 11.03125 C 4.925781 10.257812 5.449219 9.578125 6.195312 9.378906 L 6.292969 9.355469 L 6.292969 3.472656 L 6.976562 3.472656 L 6.976562 9.355469 L 7.074219 9.378906 C 7.820312 9.578125 8.34375 10.257812 8.34375 11.03125 Z M 6.71875 9.890625 C 6.679688 9.710938 6.496094 9.589844 6.3125 9.632812 C 5.664062 9.78125 5.210938 10.347656 5.210938 11.011719 C 5.210938 11.199219 5.363281 11.351562 5.550781 11.351562 C 5.738281 11.351562 5.894531 11.199219 5.894531 11.011719 C 5.894531 10.671875 6.132812 10.375 6.460938 10.300781 C 6.644531 10.257812 6.761719 10.074219 6.71875 9.890625 Z M 6.71875 9.890625 "/>
                </g>
            </svg>
            <p>${weather.main.temp}º</p>
       </div>

       <div class="weather_item">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30pt" height="30pt" viewBox="0 0 15 15" version="1.1">
                <g id="surface1">
                    <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 13.675781 8.949219 C 13.996094 8.492188 14.171875 7.945312 14.171875 7.386719 C 14.171875 6.582031 13.808594 5.816406 13.191406 5.300781 C 13.210938 5.140625 13.222656 4.992188 13.222656 4.847656 C 13.222656 2.824219 11.578125 1.179688 9.554688 1.179688 C 8.34375 1.179688 7.207031 1.789062 6.527344 2.78125 C 6.1875 2.605469 5.808594 2.515625 5.421875 2.515625 C 4.167969 2.515625 3.132812 3.476562 3.015625 4.710938 C 1.714844 4.929688 0.761719 6.042969 0.761719 7.386719 C 0.761719 8.671875 1.671875 9.765625 2.894531 10.035156 C 2.71875 10.386719 2.621094 10.777344 2.621094 11.191406 C 2.621094 12.640625 3.800781 13.820312 5.25 13.820312 L 11.15625 13.820312 C 11.253906 13.820312 11.347656 13.816406 11.4375 13.804688 C 13.03125 13.652344 14.238281 12.324219 14.238281 10.71875 C 14.238281 10.0625 14.027344 9.449219 13.675781 8.949219 Z M 11.089844 7.617188 C 10.5 6.777344 9.550781 6.28125 8.519531 6.28125 C 7.113281 6.28125 5.875 7.226562 5.496094 8.5625 C 5.210938 8.5625 4.6875 8.59375 4.117188 8.871094 C 3.679688 9.082031 3.382812 9.355469 3.203125 9.546875 C 3.203125 9.550781 3.199219 9.550781 3.195312 9.554688 C 2.117188 9.414062 1.292969 8.488281 1.292969 7.386719 C 1.292969 6.242188 2.152344 5.304688 3.292969 5.207031 L 3.53125 5.175781 L 3.53125 4.933594 C 3.53125 3.890625 4.378906 3.042969 5.421875 3.042969 C 5.796875 3.042969 6.15625 3.152344 6.46875 3.359375 L 6.703125 3.515625 L 6.84375 3.273438 C 7.40625 2.308594 8.445312 1.707031 9.554688 1.707031 C 11.285156 1.707031 12.695312 3.117188 12.695312 4.84375 C 12.695312 5.007812 12.679688 5.179688 12.644531 5.371094 L 12.621094 5.53125 L 12.75 5.625 C 13.316406 6.046875 13.640625 6.6875 13.640625 7.386719 C 13.640625 7.789062 13.53125 8.183594 13.324219 8.523438 C 13.136719 8.335938 12.78125 8.023438 12.242188 7.816406 C 11.765625 7.636719 11.34375 7.613281 11.089844 7.617188 Z M 13.132812 9.101562 C 13.492188 9.546875 13.707031 10.109375 13.707031 10.71875 C 13.707031 12.050781 12.707031 13.152344 11.382812 13.28125 C 11.308594 13.289062 11.234375 13.292969 11.15625 13.292969 L 5.25 13.292969 C 4.089844 13.292969 3.148438 12.351562 3.148438 11.191406 C 3.148438 10.761719 3.28125 10.359375 3.503906 10.027344 C 3.605469 9.871094 3.828125 9.578125 4.21875 9.355469 C 4.652344 9.113281 5.0625 9.09375 5.25 9.09375 L 5.917969 9.09375 L 5.964844 8.882812 C 6.214844 7.679688 7.289062 6.808594 8.519531 6.808594 C 9.417969 6.808594 10.242188 7.265625 10.722656 8.027344 L 10.800781 8.148438 C 11.058594 8.132812 11.542969 8.136719 12.09375 8.367188 C 12.625 8.589844 12.960938 8.914062 13.132812 9.101562 Z M 13.132812 9.101562 "/>
                </g>
            </svg>
            <p>${weather.clouds.all}%</p>
       </div>

       <div class="weather_item">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="23pt" height="25pt" viewBox="0 0 28 30" version="1.1">
                <g id="surface1">
                    <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 27.988281 12.414062 C 27.988281 11.078125 27.589844 10.152344 26.996094 9.171875 L 21.6875 0.425781 C 21.523438 0.15625 21.230469 -0.0078125 20.914062 -0.00390625 C 20.597656 0 20.308594 0.171875 20.152344 0.445312 L 15.738281 8.179688 L 11.035156 0.425781 C 10.871094 0.15625 10.578125 -0.00390625 10.261719 0 C 9.945312 0.00390625 9.65625 0.171875 9.5 0.445312 L 1.390625 14.65625 C 0.488281 16.238281 0.015625 18.023438 0.0117188 19.839844 C 0.0117188 25.535156 4.652344 30 10.570312 30 C 13.414062 30 16.054688 29 18.015625 27.183594 C 20.023438 25.320312 21.132812 22.761719 21.132812 19.976562 C 21.132812 19.742188 21.121094 19.496094 21.105469 19.25 L 21.109375 19.25 C 24.90625 19.242188 27.984375 16.1875 27.988281 12.414062 Z M 20.925781 1.691406 L 25.890625 9.867188 C 26.484375 10.84375 26.695312 11.511719 26.695312 12.417969 C 26.714844 14.417969 25.65625 16.273438 23.914062 17.28125 C 22.175781 18.285156 20.027344 18.285156 18.289062 17.28125 C 16.550781 16.273438 15.488281 14.417969 15.511719 12.417969 C 15.511719 11.636719 15.675781 10.976562 16.074219 10.207031 C 16.097656 10.167969 16.117188 10.128906 16.136719 10.089844 C 16.167969 10.027344 16.203125 9.964844 16.238281 9.902344 Z M 19.707031 20.066406 C 19.707031 22.457031 18.765625 24.652344 17.046875 26.242188 C 15.34375 27.820312 13.03125 28.691406 10.535156 28.691406 C 8.054688 28.691406 5.746094 27.796875 4.03125 26.179688 C 2.3125 24.550781 1.363281 22.324219 1.363281 19.921875 C 1.363281 18.34375 1.773438 16.792969 2.558594 15.421875 L 10.25 1.949219 L 14.90625 9.625 C 14.539062 10.425781 14.351562 11.292969 14.359375 12.167969 C 14.363281 15.386719 16.53125 18.203125 19.652344 19.054688 C 19.6875 19.390625 19.707031 19.730469 19.710938 20.066406 Z M 19.707031 20.066406 "/>
                </g>
            </svg>
            <p>${weather.main.humidity}%</p>
       </div>
    </div>
    `;
}

const renderSingleViewFooter = () => {
    const footer = document.querySelector(".footer");
    footer.innerHTML = 
    `
    <button class="second_footer">
        <span class="fa fa-save"></span>
        <span class="save">Guardar</span>
    </button>
    `;
     

    footer.addEventListener("click", () => {
        saveMarker();
        loadMapView();
    });
}

const saveMarker = () => {
    markersPositions.push(weather);
    localStorage.setItem("markers", JSON.stringify(markersPositions));

    const storingObj = {
        lat: weather.coord.lat,
        lng: weather.coord.lon,
        zoom: 11
    }
    localStorage.setItem("map-info", JSON.stringify(storingObj));
}