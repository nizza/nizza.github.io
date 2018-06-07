//var queue = d3.queue();


d3.queue()
    //.defer(d3.json, "/data/geojson/departements.json")
    .defer(d3.csv, "./data/all_data.csv")
    .await(initMap);

function initMap(error, dataCsv) {

  if(error) { console.log(error); }

  //console.log(dataCsv);

  //Vue.use(VueMaterial.default);
  //Vue.use(Vuetify);

  // Adding count field for plotting
  dataCsv.forEach(function(obj) { obj.count = 1; });

  // Extracting the times list
  var times = d3.map(dataCsv, function(d){return d['time'];}).keys().sort();

  // Selecting the first entry
  var timeSelected = times[0]

  // filtering data by time
  var filteredData = dataCsv.filter(data => data.time == timeSelected);

  Vue.use(Vuetify)
  var app = new Vue({
    el: '#app',
    data: {
      times: times,
      timeSelected: timeSelected
    },
    methods: {
      onTimeChange:function(timeSelected){
          console.log(timeSelected);
          filteredData = dataCsv.filter(data => data.time == timeSelected);
          console.log(filteredData.length);
          plotData(filteredData);
          //redrawMap(brandSelected, map)
      }
    }

  })


  // Initializing the map, centered in Paris
  var map = L.map('map');
  map.setView([48.873213, 2.32], 11);
  mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
  L.tileLayer(
     'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; ' + mapLink + ' Contributors',
      maxZoom: 17,
    }).addTo(map);



  // dataCsv.forEach(function(point) {
  //     //console.log(point);
  //     //console.log(point["lat"]);
  //     var latLng = new google.maps.LatLng(point["lat"], point["lng"]);
  //     //var marker = new google.maps.Marker({position: {point["lat"], point["lng"]}, map: map});
  //     var marker = new google.maps.Marker({
  //                             position: latLng,
  //                             map: map
  //                       });
  // });

  //Initializing the heatmap layer
  // var cfg = {
  //   // radius should be small ONLY if scaleRadius is true (or small radius is intended)
  //   // if scaleRadius is false it will be the constant radius used in pixels
  //   "radius": 1000,
  //   "maxOpacity": .8, 
  //   // scales the radius based on map zoom
  //   "scaleRadius": true, 
  //   // if set to false the heatmap uses the global maximum for colorization
  //   // if activated: uses the data maximum within the current map boundaries 
  //   //   (there will always be a red spot with useLocalExtremas true)
  //   "useLocalExtrema": true,
  //   // which field name in your data represents the latitude - default "lat"
  //   latField: 'lat',
  //   // which field name in your data represents the longitude - default "lng"
  //   lngField: 'lng',
  //   // which field name in your data represents the data value - default "value"
  //   valueField: 'count'
  // };
  // var heatmapLayer = new HeatmapOverlay(cfg);
  var heatLayer = null;
  //heatmapLayer.addTo(map);


  plotData(filteredData);

 
  function plotData(dataCsv){


    if (heatLayer != null)
      map.removeLayer(heatLayer);


    var dataArrays = dataCsv.map(data => [data["lat"], data["lng"]]);

    console.log(dataArrays)

    heatLayer= L.heatLayer(dataArrays).addTo(map);
    heatLayer.addTo(map);
    console.log(heatLayer);
    console.log(map);

    

  }
 

}

