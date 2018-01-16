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

	_socket.on('led', (on) => {
		if (!!on) {
			$('#light').prop('checked', true);
		} else {
			$('#light').prop('checked', false);
		}
	})

	/**
	 * bind event
	 */
	$('#light').on('change', _handleLedChange);

	/**
	 * event handler
	 */
	function _handleLedChange() {
		const isOn = $('#light').is(':checked');
		_socket.emit('turnLed', isOn);
	}
})();
