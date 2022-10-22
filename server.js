const express = require('express');
const cors = require('cors');
const request = require('request');
require('dotenv').config();
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(cors());

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/getAirQuality', (req, res) => {
  let airQualConfig = process.env.AIR_QUAL_CONFIG;
  let lat = req.query.lat;
  let lng = req.query.lng;
  const options = {
    method: 'GET',
    url: `https://api.weatherbit.io/v2.0/current/airquality?lat=${lat}&lon=${lng}&key=${airQualConfig}`,
    headers: {'Content-type': 'application/json', "Access-Control-Allow-Origin": "*"}
  };
  request(options, (err, response, body) => {
    if(err) throw new Error(err);
    console.log(response.body)
    res.send(response);
  })
});

app.get('/getStateAndCountry', (req, res) => {
  let reverseGeoApi = process.env.REVERSE_GEO_API;
  let lat = req.query.lat;
  let lng = req.query.lng;
  const options = {
    method: 'GET',
    url: `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${reverseGeoApi}`,
    headers: {'Content-type': 'application/json', "Access-Control-Allow-Origin": "*"}
  };
  request(options, (err, response, body) => {
    if(err) throw new Error(err);
    res.json(response.body);
  })
});

app.listen(process.env.PORT || 5000)
