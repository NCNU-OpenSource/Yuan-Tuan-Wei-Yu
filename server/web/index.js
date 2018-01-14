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

	/**
	 * ws event
	 */
	_socket.on('value', (data) => {
		Object.keys(data).forEach((key, i) => {
			$(`#${key}`).text(data[key]);
		});
	});
})();
