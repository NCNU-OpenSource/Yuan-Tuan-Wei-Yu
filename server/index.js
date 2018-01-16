const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const cors = require('cors');
const Gpio = require('onoff').Gpio;
const { spawn } = require('child_process');

const _led = new Gpio(16, 'out');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(express.static('server/web'));

/**
 * ws event
 */
io.on('connection', function (socket) {
	console.log('client connected');

	socket.on('turnLed', function (isOn) {
		if (isOn) {
			spawn('python', ['/home/pi/Yuan-Tuan-Wei-Yu/python/ledOn.py']);
		} else {
			spawn('python', ['/home/pi/Yuan-Tuan-Wei-Yu/python/ledOff.py']);
		}

		socket.emit('led', isOn);
	});

	/**
	 * get led on or off
	 */
	socket.emit('led', _led.readSync());

	socket.on('disconnect', function () {
		console.log('user disconnected');
	});
});

// setInterval(() => {
// 	io.sockets.emit('value', { ph: Math.random() });
// }, 3000);

// setInterval(() => {
// 	dht22.read(22, 4, function(err, temperature, humidity) {
// 		if (!err) {
// 			console.log('temp: ' + temperature.toFixed(1) + '°C, ' + 'humidity: ' + humidity.toFixed(1) + '%');
// 			io.sockets.emit('value', { temp: temperature.toFixed(1)});
// 		}
// 	});
// }, 1000);

http.listen(3000, function(){
	console.log('listening on 127.0.0.1:3000');
});

