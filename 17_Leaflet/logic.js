// Add your APIKEY.
var APIKEY = "";

// Define where we are on the map.
var myMaps = L.map("map", {
    center: [25.09, -40.71],
    zoom: 3, 
}); 

// Link API. Get data for earthquakes.
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryURL, function(data) {
    createFeatures(data.features);
});

// Assign colors for earthquake magnitude.
var earthquakeMap = L.featureGroup();
function createFeatures(earthquakeData) {
    function chooseColor(mag) {
        if (mag>=0 && mag<1) {
            return "#00FD51";
        }
        if (mag>=1 && mag<2) {
            return "#C7FD00";
        }
        if (mag>=2 && mag<3) {
            return "#FDF200";
        }
        if (mag>=3 && mag<4) {
            return "#F9CC00";
        }
        if (mag>=4 && mag<5) {
            return "#FD6B00";
        }
        if (mag>=5) {
            return "#FD1300";
        }
    }
    
    // Create layer of earthquakes.
    for (let feature of earthquakeData) {
        earthquakeMap.addLayer(L.circle([`${feature.geometry.coordinates[1]}`, `${feature.geometry.coordinates[0]}`], {
                color: "grey",
                fillColor: chooseColor(feature.properties.mag),
                fillOpacity: 0.7,
                stroke: true,
                weight: 0.5,
                radius: feature.properties.mag*30000
            }).bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}`));
        };
    createMap();
};
//I think I need something with the earthquake layer to link it to the testTimeLayer thing.



// Get data, create layer for faultlines.
var faultMap = L.featureGroup()
d3.csv("./Resources/PB2002_steps.csv", function(error, data){
    if (error) return console.warn(error);
    for (i=0; i<data.length; i++) {
        var points = [[+data[i].StartLat, +data[i].StartLong], [+data[i].FinalLat, +data[i].FinalLong]];
        var line = L.polyline(points, {
                color: "orange",
                weight: 2
        });
        faultMap.addLayer(line);
    };
});

// Define map tile layers.  
var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=" + APIKEY).addTo(myMaps);
var streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=" + APIKEY);
var greyMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=" + APIKEY);

// Add control button with clickable options.
function createMap() {
    var baseMaps = {
        "Satellite Map": satelliteMap,
        "Greyscale": greyMap,
        "Outdoors": streetMap
    };
    var overlayMaps = {
        "Earthquakes": earthquakeMap,
        "Fault Lines": faultMap
    }
    L.control.layers(baseMaps, overlayMaps).addTo(myMaps);
};

// Add a legend.
function getColor(d) {
    switch(d) {
        case 1: return "#00FD51";
        case 2: return "#C7FD00";
        case 3: return "#FDF200";
        case 4: return "#F9CC00";
        case 5: return "#FD6B00";
        case 6: return "#FD1300";
        default: return "#ffff33";
    }
};
var Legend = L.control({position: "bottomright"});
Legend.onAdd = function(map) {
    var legdiv = L.DomUtil.create('div', 'info legend'),
        status = [1, 2, 3, 4, 5, 6],
        labels = ['0-1', '1-2', '2-3', '3-4', '4-5', '5+'];
    // loop through our status intervals and generate a label with a coloured square for each interval
    for (var i = 0; i < status.length; i++) {
        legdiv.innerHTML +=
            '<i style="background:' + getColor(status[i]) + '"></i> ' +	(status[i] ? labels[i] + '<br>' : '+');
    }
    return legdiv;
};
Legend.addTo(myMaps);
