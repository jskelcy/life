/** @jsx React.DOM */
(function() {

  var Cell = React.createClass({
    handleCellClicked: function() {
      this.props.handleCellClicked(this.props.row, this.props.col);
    },

    render: function() {
      var dim = this.props.dim;
      return (
        <rect
        width={dim} height={dim} fill={this.props.fill}
        stroke='black' strokeWidth='1'
        x={dim*this.props.col} y={dim*this.props.row}
        onClick={this.handleCellClicked}>
        </rect>
      );
    }
  });

  var Board = React.createClass({
    runningQ: false,

    handleCellClicked: function(r, c) {
      this.state[[r, c]].val = this.state[[r, c]].val === 1 ? 0: 1;
      function delay() {
        var start = new Date().getTime();
        var end = new Date().getTime();
        while ( end - start < 1000) {
          end = new Date().getTime();
        }
      }
      cancelAnimationFrame(this.intervalID);
      if (this.runningQ) {
        this.forceUpdate(this.handleStart);
      } else {
        this.forceUpdate();
      }
    },

    render: function() {
      var a = [];
      for (var row=0; row<50; row++) {
        for (var col=0; col<50; col++) {
          a.push(<Cell
                 dim='10' col={col} row={row}
                 key={row + ',' + col}
                 fill={this.state[[row, col]].val === 1 ? 'black': 'white'}
                 handleCellClicked={this.handleCellClicked}
                 />);
        }
      }
      return (
        <div>
          <input id="startButton" type="button" value="start" onClick={this.handleStart}/>
          <input id="stopButton" type="button" value="stop" onClick={this.handleStop}/>
          <svg>
            {a}
          </svg>
        </div>
      )
    },

    handleStart: function() {
      this.runningQ = true;
      this.intervalID = requestAnimationFrame(this.update);
    },

    handleStop: function() {
      this.runningQ = false;
      cancelAnimationFrame(this.intervalID);
    },

    update: function() {
      var newState = {};
      for (var row = 0; row < 50; row++) {
        for (var col = 0; col < 50; col++) {
          if(checkState(this.state, row, col)) {
            newState[[row, col]] = {val: this.state[[row, col]].val === 1 ? 0 : 1};
          } else {
            newState[[row, col]] = {val: this.state[[row, col]].val};
          }
        }
      };

      for (var row = 0; row < 50; row++) {
        for (var col = 0; col < 50; col++) {
          newState[[row, col]].neighbors = [];
          var rStart = Math.max(row - 1, 0);
          var cStart = Math.max(col - 1, 0);
          var rEnd = Math.min(row + 1, 50 - 1);
          var cEnd = Math.min(col + 1, 50 - 1);

          for (var r = rStart ; r <= rEnd; r ++ ) {
            for (var c = cStart ; c <= cEnd ; c ++ ) {
              if (r === row && c === col) continue;
              newState[[row, col]].neighbors.push(newState[[r, c]]);
            }
          }
        }
      };
      console.log(newState);
      this.setState(newState);
      this.intervalID = requestAnimationFrame(this.update);
    },

    getInitialState: function() {
      var _state = {};
      for (var row = 0 ; row < 50 ; row ++ ) {
        for (var col = 0 ; col < 50; col ++ ) {
          _state[[row, col]] = {val: Math.round(Math.random())};
        }
      };

      for (var row = 0; row < 50; row++) {
        for (var col = 0; col < 50; col++) {
          _state[[row, col]].neighbors = [];

          var rStart = Math.max(row - 1, 0);
          var cStart = Math.max(col - 1, 0);
          var rEnd = Math.min(row + 1, 50 - 1);
          var cEnd = Math.min(col + 1, 50 - 1);

          for (var r = rStart ; r <= rEnd; r ++ ) {
            for (var c = cStart ; c <= cEnd ; c ++ ) {
              if (r === row && c === col) continue;
              _state[[row, col]].neighbors.push(_state[[r, c]]);
            }
          }
        }
      };
      return _state;
    }
  });

  React.renderComponent(<Board />, document.getElementById("svg_canvas"));

  function checkState(_state, row, col) {
    var currentState = _state[[row, col]].val;
    var sum = 0;
    var nbs = _state[[row, col]].neighbors;
    for (var i = 0; i < nbs.length; i++) {
      sum += nbs[i].val
    }
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
  };

})()
