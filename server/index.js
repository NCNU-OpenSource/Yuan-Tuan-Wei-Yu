const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const path = require('path');
const cors = require('cors');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(express.static('web'));

/**
 * API handler
 */
app.get('/', cors(), function (req, res) {
	res.json({
		msg: '安安'
	});
});

http.listen(3000, function(){
	console.log('listening on 127.0.0.1:3000');
});
