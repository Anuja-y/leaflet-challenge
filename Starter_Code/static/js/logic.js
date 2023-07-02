// Base url for the data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Retrive data using d3
d3.json(url).then(function(data){
    console.log(data);
    createFeatures(data.features);
});

// Function to decide the size of the marker
function markerSize(magnitude){
    return magnitude * 10000;
};

// Function to decide colour of the marker 
function selectColour(depth){
    if (depth <= 10) return "#00FFEA";
    else if (depth <= 30) return "#00C8FF";
    else if (depth <= 50) return "#0066FF";
    else if (depth <= 70) return "#000DFF";
    else if (depth <= 90) return "#2F255E";
    else return "#1A162B";

};

// Function to create features for the map
function createFeatures(geoData){
    function onEachFeature(feature, layer){
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Time: ${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}</p><hr><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }

    let earthquakes = L.geoJSON(geoData,{
        onEachFeature: onEachFeature,
        
        // Features
        pointToLayer: function(feature, coordinate) {
            let markers = {
                radius: markerSize(feature.properties.mag),
                fillColor: selectColour(feature.geometry.coordinates[2]),
                fillOpacity: 0.75,
                color: selectColour(feature.geometry.coordinates[2]),
                weight: 1,
            }
            return L.circle(coordinate, markers);
        }
    });

    createMap(earthquakes);
}


function createMap(earthquakes) {

    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [street, earthquakes]
    });
  
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    let legend = L.control({position: "bottomright"});

     legend.onAdd = function () {
     let div = L.DomUtil.create("div", "info legend"),
         depth = [-10, 10, 30, 50, 70, 90];

         //div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

     // loop through density intervals
     for (let i = 0; i < depth.length; i++) {
         div.innerHTML +=
             '<i style="background:' + selectColour(depth[i] + 1) + '"></i> ' +
             depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
     }
     return div;
    };

    legend.addTo(myMap);
  }
  
