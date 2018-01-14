const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const cors = require('cors');
// const dht22 = require('node-dht-sensor');

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

	socket.on('register', function (data) {
	});

	socket.on('disconnect', function () {
		console.log('user disconnected');
	});
});

setInterval(() => {
	io.sockets.emit('value', { ph: Math.random() });
}, 3000);

http.listen(3000, function(){
	console.log('listening on 127.0.0.1:3000');
});
