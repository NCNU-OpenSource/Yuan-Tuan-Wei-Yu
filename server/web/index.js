(function () {
	/**
	 * parivate variable
	 */
	const _socket = io();
	let _sensorInterval;

	/**
	 * init
	 */
	setInterval(function () {
		$('.snapshot').attr('src', '/image/image.jpg?' + Math.random());
	}, 1000);

	/**
	 * ws event
	 */
	_socket.on('value', function (data) {
		Object.keys(data).forEach(function (key, i) {
			$('#' + key).text(data[key]);
		});
	});

	_socket.on('led', function (on) {
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
	$('.btn-feed').on('click', _handleFeed);
	$('.btn-setTemp').on('click', _handleSetTemp);

	/**
	 * event handler
	 */
	function _handleLedChange() {
		const isOn = $('#light').is(':checked');
		_socket.emit('turnLed', isOn);
	}

	function _handleFeed() {
		const q = $('.input-q:checked').val();
		_socket.emit('feed', q);
	}

	function _handleSetTemp() {
		_socket.emit('setTemp', $('#temperature').val());
	}
})();
