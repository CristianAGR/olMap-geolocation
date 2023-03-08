import Feature from 'ol/Feature.js';
import Geolocation from 'ol/Geolocation.js';
import Map from 'ol/Map.js';
import Point from 'ol/geom/Point.js';
import View from 'ol/View.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import { fromLonLat } from 'ol/proj.js';

import { Polygon } from 'ol/geom';


const form = document.getElementById("formSection");
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const nombreInput = document.getElementById("name").value;
  const longitudInput = document.getElementById("longitude").value;
  const latitudInput = document.getElementById("latitude").value;
  //const mapa = document.getElementById("map")
  const miPopup = document.getElementById("mi-popup")

  // function mostrarMapa() {
  //   mapa.style.display = "block"
  // }
  // funcion para mostrar el popup
  function mostrarPopup() {
    miPopup.style.display = "block";
    miPopup.innerHTML = "Nos vemos pronto: " + nombreInput
 }

 

  const vector = new Feature({
    geometry: new Point(fromLonLat([longitudInput, latitudInput]))
  });

  vector.setStyle(new Style({
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({
        color: '#FC0400',
      }),
      stroke: new Stroke({
        color: '#fff',
        width: 2,
      }),
    }),
  }),)
  
  // Crear un polígono que represente la zona
var polygon = new Polygon([[
  [-101.435326, 21.219154],
  [-101.432579, 21.008413],
  [-101.938981, 21.005208],
  [-101.936577, 21.216593],
  [-101.435326, 21.219154]
]]);

// Crear una coordenada que se verificará si está dentro del polígono
var coordinate = [longitudInput, latitudInput];

// Verificar si la coordenada está dentro del polígono
if (polygon.intersectsCoordinate(coordinate)) {
  
  console.log("La coordenada está dentro de la zona");
    if (vectorSource.hasFeature(vector)) {
      vectorSource.removeFeature(vector)
      vectorSource.refresh
    }
    vectorSource.addFeature(vector)
    
    // ubicacion de la compu
    if (!vectorSource.hasFeature(positionFeature)) {
      vectorSource.addFeature(positionFeature)
    }
} else {
  console.log("La coordenada está fuera de la zona");
  alert("La coordenada está fuera de la zona")
}

  mostrarMapa()
  mostrarPopup()
})


const view = new View({
  center: fromLonLat([-101.685265, 21.121187]),
  zoom: 12
})

const tileLayer = new TileLayer({
  source: new OSM()
});
const map = new Map({
  target: 'map',
  layers: [tileLayer],
  view: view
});

// map.on( "click", function(e) {
//   console.log(e)
// })

const vectorSource = new VectorSource(
  //features: [accuracyFeature, positionFeature],
)

const vectorLayer = new VectorLayer({
  source: vectorSource
});
map.removeLayer(vectorLayer)
map.addLayer(vectorLayer)



// const vectorFeatures = [
//   {
//     geometry: new Point(fromLonLat([form.longitudInput, form.latitudInput])),
//     attributes: {
//       name: 'Punto 1'
//     }
//   },
// ];

// get ubication
const geolocation = new Geolocation({
  // enableHighAccuracy must be set to true to have the heading value.
  trackingOptions: {
    enableHighAccuracy: true,
  },
  projection: view.getProjection(),
});

function el(id) {
  return document.getElementById(id);
}

geolocation.setTracking(true);

// update the HTML page when the position changes.
geolocation.on(true, function () {
  el('accuracy').innerText = geolocation.getAccuracy() + ' [m]';
  el('altitude').innerText = geolocation.getAltitude() + ' [m]';
  el('altitudeAccuracy').innerText = geolocation.getAltitudeAccuracy() + ' [m]';
  el('heading').innerText = geolocation.getHeading() + ' [rad]';
  el('speed').innerText = geolocation.getSpeed() + ' [m/s]';
  el('coordinates').innerText = geolocation.getPosition() + ' [l/l]';
});

// handle geolocation error.
geolocation.on('error', function (error) {
  const info = document.getElementById('info');
  info.innerHTML = error.message;
  info.style.display = '';
});

const accuracyFeature = new Feature();
geolocation.on('change:accuracyGeometry', function () {
  accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
});

const positionFeature = new Feature();
positionFeature.setStyle(
  new Style({
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({
        color: '#3399CC',
      }),
      stroke: new Stroke({
        color: '#fff',
        width: 2,
      }),
    }),
  })
);

geolocation.on('change:position', function () {
  const coordinates = geolocation.getPosition();
  positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
});

// vectorFeatures.forEach((vectorFeature) => {
//   const vector = new Feature({
//     geometry: vectorFeature.geometry
//   });

//   vector.setProperties(vectorFeature.attributes);

//   vectorSource.addFeature(vector);
// });

//vectorSource.addFeature(accuracyFeature)