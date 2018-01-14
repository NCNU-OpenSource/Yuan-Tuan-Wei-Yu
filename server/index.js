const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const path = require('path');
const cors = require('cors');
const dht22 = require('node-dht-sensor');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(express.static('web'));

/**
 * API handler
 */
app.get('/sensors', cors(), function (req, res) {
	dht22.read(22, 4, function(err, temperature, humidity) {
		if (!err) {
			console.log('temp: ' + temperature.toFixed(1) + '°C, ' + 'humidity: ' + humidity.toFixed(1) + '%');


			res.json({
				ph: 0.6,
				temp: temperature.toFixed(1),
				tds: 66
			});
		}
	});
});

http.listen(3000, function(){
	console.log('listening on 127.0.0.1:3000');
});
