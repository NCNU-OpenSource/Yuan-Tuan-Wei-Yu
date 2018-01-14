(() => {
	/**
	 * parivate variable
	 */
	const _socket = io();
	let _sensorInterval;

	/**
	 * init
	 */
	setInterval(() => {
		$('.snapshot').attr('src', `http://163.22.32.201:8081/web/snapshot.jpg?${Math.random()}`);
	}, 1000);

	// _sensorInterval = setInterval(_rednerSensors, 1000);

	/**
	 * ws event
	 */
	_socket.on('dht22', (data) => {
		console.log(data);
	});

	/**
	 * private method
	 */
	function _rednerSensors() {
		_getSensors().then((data) => {
			const { ph, temp, tds} = data;
			$('#ph').text(ph);
			$('#temp').text(temp);
			$('#tds').text(tds);
		}).catch((err) => {
			console.error(err);
		});
	}

	function _getSensors() {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: `/sensors`,
				type: 'get',
				dataType: 'json',
				success: function (data) {
					console.log(data);
					resolve(data);
				},
				error: function (jqXHR) {
					console.error(jqXHR);
					reject(jqXHR);
				}
			});
		});
	}
})();
