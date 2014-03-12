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
    fps: 1000,
    time: new Date().getTime(),

    getInitialState: function() {
      var state = {};
      for (var row = 0 ; row < 50 ; row ++ ) {
        for (var col = 0 ; col < 50; col ++ ) {
          state[[row,col]] = Math.round(Math.random());
        }
      };
      return state;
    },

    render: function() {
      var a = [];
      for (var row=0; row<50; row++) {
        for (var col=0; col<50; col++) {
          a.push(<Cell
                 dim='10' col={col} row={row}
                 key={row + ',' + col}
                 fill={this.state[[row,col]] ? 'black': 'white'}
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

    update: function() {
      this.time = new Date().getTime(); 
      var newState = {};
      for (var r = 0 ; r < 50 ; r ++ ) {
        for (var c = 0 ; c < 50 ; c ++ ) {
          if(this.checkState(this.state, r, c)) {
            newState[[r,c]] = this.state[[r,c]] ? 0 : 1;
          }
        }
      }

      this.setState(newState);

      var now = new Date().getTime();
      var delta = now - this.time;
      while (delta < 1000 / this.fps) {
        now = new Date().getTime();
        delta = now - this.time;
      }
      this.intervalID = requestAnimationFrame(this.update);
    },

    checkState: function(state, row, col) {
      var rStart = Math.max(row - 1, 0);
      var cStart = Math.max(col - 1, 0);
      var rEnd = Math.min(row + 1, 50 - 1);
      var cEnd = Math.min(col + 1, 50 - 1);

      var sum = 0;
      var currentState = state[[row,col]];

      for (var r = rStart ; r <= rEnd; r ++ ) {
        for (var c = cStart ; c <= cEnd ; c ++ ) {
          sum += state[[r,c]];
        }
      }

      sum -= state[[row,col]];
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
    },

    handleCellClicked: function(r, c) {
      cancelAnimationFrame(this.intervalID);
      this.state[[r,c]] = this.state[[r,c]] ? 0: 1;
      if (this.runningQ) {
        this.forceUpdate(this.handleStart);
      } else {
        this.forceUpdate();
      }
    },

    handleStart: function() {
      this.runningQ = true;
      this.intervalID = requestAnimationFrame(this.update);
    },

    handleStop: function() {
      this.runningQ = false;
      cancelAnimationFrame(this.intervalID);
    },
  });

  React.renderComponent(<Board />, document.getElementById("svg_canvas"));
})()