const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const cors = require('cors');
const Gpio = require('onoff').Gpio;
const { spawn } = require('child_process');
const ds18b20 = require('ds18b20');

const _led = new Gpio(16, 'out');
let _targetTemp = null;
let _bonOn = false;

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

	// turn led on/off
	socket.on('turnLed', function (isOn) {
		if (isOn) {
			spawn('python', ['/home/pi/Yuan-Tuan-Wei-Yu/python/ledOn.py']);
		} else {
			spawn('python', ['/home/pi/Yuan-Tuan-Wei-Yu/python/ledOff.py']);
		}

		socket.emit('led', isOn);
	});

	// feed
	socket.on('feed', function (q) {
		const timeout = {
			'1': 8,
			'2': 5,
			'3': 3
		};

		const p = spawn('python', ['/home/pi/Yuan-Tuan-Wei-Yu/python/servo.py']);
		setTimeout(function () {
			p.kill();
		}, timeout[q] * 1000);
	});

	// get ds18b20 id
	ds18b20.sensors(function (err, ids) {
		setInterval(function () {
			const temp = ds18b20.temperatureSync(ids[0]);
			socket.emit('value', { temp: temp });

			if (!!_targetTemp) {
				if (temp < _targetTemp) {
					if (!_bonOn) {
						// bonOn
						console.log('turn bon on');
						_bonOn = true;
						spawn('python', ['/home/pi/Yuan-Tuan-Wei-Yu/python/bonOn.py']);
					}
				} else {
					if (!!_bonOn) {
						// bonOff
						console.log('turn bon off');
						_bonOn = false;
						spawn('python', ['/home/pi/Yuan-Tuan-Wei-Yu/python/bonOff.py']);
					}
				}
			}
		}, 1000);
	});

	// set temp
	socket.on('setTemp', function (temp) {
		console.log('set target temp: ' + temp);
		_targetTemp = temp;
	});

	// get led on or off
	socket.emit('led', _led.readSync());

	socket.on('disconnect', function () {
		console.log('user disconnected');
	});
});

/**
 * take snapshot
 */
spawn('watch', ['-n', '3', 'sh', '/home/pi/Yuan-Tuan-Wei-Yu/snapshot.sh']);

http.listen(3000, function(){
	console.log('listening on 127.0.0.1:3000');
});

