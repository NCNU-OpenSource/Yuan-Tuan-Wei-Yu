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
		$('.snapshot').attr('src', `https://ip201.puli32.ncnu.edu.tw/web/snapshot.jpg?${Math.random()}`);
	}, 1000);

	/**
	 * ws event
	 */
	_socket.on('value', (data) => {
		Object.keys(data).forEach((key, i) => {
			$(`#${key}`).text(data[key]);
		});
	});

	_socket.on('led', (data) => {
		console.log(data);
	})
})();
