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
      this.handleStop();
      this.state.grid[r][c] = this.state.grid[r][c] ? 0: 1;
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
                 fill={this.state.grid[row][col] ? 'black': 'white'}
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
      this.intervalID = setInterval(this.update, 50);
    },

    handleStop: function() {
      this.runningQ = false;
      clearInterval(this.intervalID);
    },

    update: function() {
      var newGrid = [];
      for (var r = 0 ; r < 50 ; r ++ ) {
        var row = [];
        for (var c = 0 ; c < 50 ; c ++ ) {
          if(checkState(this.state.grid, r, c)) {
            row.push(this.state.grid[r][c] ? 0 : 1)
          } else {
            row.push(this.state.grid[r][c])
          }
        }
        newGrid.push(row);
      }
      this.setState( {grid: newGrid} );
    },

    getInitialState: function() {
      var _state = [];
      for (var row = 0 ; row < 50 ; row ++ ) {
        var r = [];
        for (var col = 0 ; col < 50; col ++ ) {
          //r.push(Math.round(Math.random()));
          r.push(0);
        }
        _state.push(r);
      };
      return {
        boardDim: 50,
        grid: _state
      };
    }
  });

  React.renderComponent(<Board />, document.getElementById("svg_canvas"));

  function checkState(_state, row, col) {
    var rStart = Math.max(row - 1, 0);
    var cStart = Math.max(col - 1, 0);
    var rEnd = Math.min(row + 1, 50 - 1);
    var cEnd = Math.min(col + 1, 50 - 1);

    var sum = 0;
    var currentState = _state[row][col];

    for (var r = rStart ; r <= rEnd; r ++ ) {
      for (var c = cStart ; c <= cEnd ; c ++ ) {
        sum += _state[r][c];
      }
    }

    sum -= _state[row][col];
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
