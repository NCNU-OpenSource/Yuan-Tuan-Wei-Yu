(() => {
	/**
	 * parivate variable
	 */
	const apiBase = CONFIG.apiBase;
	let sensorInterval;

	/**
	 * init
	 */
	setInterval(() => {
		$('.snapshot').attr('src', `http://163.22.32.201:8081/web/snapshot.jpg?${Math.random()}`);
	}, 1000);

	sensorInterval = setInterval(_rednerSensors, 1000);

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
				url: `http://${apiBase}/sensors`,
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
