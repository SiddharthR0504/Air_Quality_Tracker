
require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/layers/FeatureLayer",
  "dojo/dom",
  "dojo/domReady!",

], (Map, SceneView, FeatureLayer) => {
  const map = new Map({
    basemap: 'streets-vector'
  });

  const view = new SceneView({
    map: map,
    container: container
  });
  view.popup.autoOpenEnabled = false;
  view.on("click", evt => {
    if (evt.mapPoint) {
      callLocationAPI(evt.mapPoint.latitude, evt.mapPoint.longitude)
      .then(response => {
        return response.text()
      })
      .then(data => {
        let areaData = JSON.parse(JSON.parse(data));
        if (areaData.features[0].properties.state === undefined) {
          areaData.features[0].properties.state = "Unknown"
        }
        callAirQualApi(evt.mapPoint.latitude, evt.mapPoint.longitude)
        .then(res => {
          return res.text()
          .then(airData => {
            let airQuality = JSON.parse(JSON.parse(airData).body).data[0].aqi;
            let pm10 = JSON.parse(JSON.parse(airData).body).data[0].pm10;
            let co = JSON.parse(JSON.parse(airData).body).data[0].co;
            let o3 = JSON.parse(JSON.parse(airData).body).data[0].o3;

            view.popup.open({
              title: areaData.features[0].properties.country?areaData.features[0].properties.state + ", " + areaData.features[0].properties.country:areaData.features[0].properties.name,
              location: evt.mapPoint,
              content: `<ul><li>AQI(Air Quality Index): ${airQuality}</li><br><li>Concentration Of PM10: ${pm10} µg/m³</li><br><li>Concentration Of Carbon Monoxide(CO): ${co} µg/m³</li><br><li>Concentration of Ozone(O3): ${o3}</li></ul>`
            });
           
          })
        })
        .catch(error => {
          console.error(error);
        });
      })
    }
  })
});

async function callLocationAPI(lat, lng) {
  let data = await fetch(`https://air-quality-tracker-hackathon.herokuapp.com/getStateAndCountry?lat=${lat}&lng=${lng}`, {
    "method": "GET",
    "headers": {
      "Content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
    }
  });
  return data
}

async function callAirQualApi(lat, lng) {
  let data = await fetch(`https://air-quality-tracker-hackathon.herokuapp.com/getAirQuality?lat=${lat}&lng=${lng}`, {
    "method": "GET",
    "headers": {
      "Content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
    }
  });
  return data
}
