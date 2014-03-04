(function() {
	game = function() {
		var base = {};

		var _svg;
		var _state = [];
		var _width = 500;
		var _height = 500;
		var _cellLength = 10;
		var _rows;
		var _cols;
		var _interval;

		for (var row = 0 ; row < 50 ; row ++ ) {
			var r = [];
			for (var col = 0 ; col < 50 ; col ++ ) {
				r.push([row, col, Math.round(Math.random())]);
			}
			_state.push(r);
		}

		base.init = function() {
			_svg = d3.select('body').append('svg')
				.style('width',_width)
				.style('height', _height);

			_rows = _state.length;
			_cols = _state[0].length;

			_cellLength = _width / _rows;

			var r = 0;
			_svg
				.selectAll('g')
				.data(_state)
				.enter()
				.append('g')
				.attr('transform', function(d,i) {
					return 'translate(0,' + (i * _cellLength) + ')';
				})
					.selectAll('rect')
					.data(function(d, i) {
						return d;
					})
					.enter()
					.append('rect')
					.attr('x', function(d,i) {
						return _cellLength * i;
					})
					.attr('width',_cellLength)
					.attr('height',_cellLength)
					.attr('stroke','black')
					.attr('fill', function(d,i) {
						if (d[2]) return 'black';
						else return 'white';
					})
					.attr('row', function(d,i) {
						return Math.floor(r++ / _cols);
					})
					.on('click', function(d, i) {
						var row = this.getAttribute('row');
						var col = i;
						base.stop();
						_state[row][col][2] = (_state[row][col][2] == 0 ? 1 : 0);
						base.render();
						base.run();
					})

			return base;
		}

		base.render = function() {
			_svg
				.selectAll('g')
					.selectAll('rect')
					.attr('fill', function(d,i) {
						if (d[2]) return 'black';
						else return 'white';
					})

			return base;
		}

		base.update = function() {
			var changes = [];

			for (var r = 0 ; r < _rows ; r ++ ) {
				var row = [];
				for (var c = 0 ; c < _cols ; c ++ ) {
					row.push(checkState(r, c));
				}
				changes.push(row);
			}

			for (var r = 0 ; r < _rows ; r ++ ) {
				for (var c = 0 ; c < _cols ; c ++ ) {
					var change = changes[r][c];
					if (change) {
						_state[r][c][2] = (_state[r][c][2] == 0 ? 1 : 0);
					}
				}
			}

			return base;
		}

		function checkState(row, col) {
			var rStart = Math.max(row - 1, 0);
			var cStart = Math.max(col - 1, 0);
			var rEnd = Math.min(row + 1, _rows - 1);
			var cEnd = Math.min(col + 1, _cols - 1);

			var sum = 0;
			var currentState = _state[row][col][2];

			for (var r = rStart ; r <= rEnd; r ++ ) {
				for (var c = cStart ; c <= cEnd ; c ++ ) {
					sum += _state[r][c][2];
				}
			}

			sum -= _state[row][col][2];
			var change = false;
			if (currentState == 1) {
				if (sum < 2) {
					change = true;
				} else if ( sum > 3 ) {
					change = true;
				}
			} else if ( currentState == 0 ) {
				if ( sum == 3) {
					change = true;
				}
			}

			return change;
		}

		base.run = function() {
			function r() {
				base.update();
				base.render();
			}
			window.clearInterval(_interval);
			_interval = window.setInterval(r, 100);

			return base;
		}

		base.stop = function() {
			window.clearInterval(_interval);

			return base;
		}

		return base;
	}

})()

