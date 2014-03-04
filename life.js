;(function(exports) {

  document.onclick = function() {console.log("doc click!"); };

  var gameState;
  var canvas;
  var rows;
  var cols;
  var intervalId;
  var numclicks = 0;

  var startAnimate = function() {
    var update = function(){
      stepGame(gameState);
      renderGrid();
    };
    clearInterval(intervalId);
    intervalId = setInterval(update, 100);
  };

  var stopAnimate = function() {
    clearInterval(intervalId);
  };

  exports.onload = function() {
    gameState = initGame();
    canvas = d3.select('#canvas').append('svg');

    canvas.
      style('height', 500).
      style('width', 500);

    renderGrid();
  };

  var initGame = function() {
    return(
      {
      dim: 50,
      grid: RandomGameGrid(50)
    }
    );
  };


  toggleCell = function(e) {
    var offsetLeft = canvas.offsetLeft;
    var offsetTop = canvas.offsetTop;
    var x = e.pageX - offsetLeft;
    var y = e.pageY - offsetTop;
    var cellWidth = 500/gameState.dim;
    var cellHeight = 500/gameState.dim;
    var i = Math.floor(y / cellHeight);
    var j = Math.floor(x / cellWidth);
    gameState.grid[i][j] = !(gameState.grid[i][j]);
    renderGrid();
  }

  var renderGrid = function() {
    var numRows = gameState.dim;
    var numCols = gameState.dim;
    var x, y;
    var cellWidth = 500/numCols;
    var cellHeight = 500/numRows;

    canvas.selectAll('g').remove();
    canvas.selectAll('rect').remove();

    rows =
      canvas.selectAll('g')
        .data(gameState.grid)
        .enter()
        .append('g');

    cols =
      rows
        .selectAll('rect')
        .data(function(d, i) { return d; })
        .enter()
        .append('rect');

    var rowi = 0;

    rows
        .attr('transform', function(d, row) {
          return 'translate(' + 0 + ',' + (row*cellHeight) + ')';
        });
    cols
      .attr('x', function(d, col) {
            return col*cellWidth;
          })
          .attr('fill', function(d, col) {
            if (d == 0) return 'white';
            else return 'black';
          })
          .attr('row', function() {
            return Math.floor(rowi++/50);
          })
          .attr('width', cellWidth + 'px')
          .attr('height', cellHeight + 'px')
          .attr('y', 0)
          .style('stroke', 'gray')
          .on('click', function(d, col) {
            numclicks++;
            console.log(numclicks);
            stopAnimate();
            var r = this.getAttribute('row');
            gameState.grid[r][col] = (gameState.grid[r][col] == 0 ? 1 : 0);
            renderGrid();
            startAnimate();
          });

  }


  var stepGame = function(gameState) {
    var newState = initGame();
    newState.grid = gameState.grid;
    var newLiving = Array();
    var newDead = Array();
    for(var i = 0; i < gameState.dim; i++){
        for(var j = 0; j < gameState.dim; j++){
            //this moves through the entire grid
            var currNode = gameState.grid[i][j];
            var livingNeighbors = 0;
            //this nested for loop with traverse the 8 nodes around the currNode
            for(var k = i - 1; k <= i + 1; k++){
                for(var m = j - 1; m <= j + 1; m++){
                    //this looks for adj node
                    if((k < 0) || (m < 0) || (k >= gameState.dim) || (m >= gameState.dim)){
                        continue;
                    }
                    livingNeighbors += gameState.grid[k][m];
                }
            }
            if(currNode){
                livingNeighbors--;
            }
            //update life of cell
            if (currNode){
                if((livingNeighbors <= 1) || (livingNeighbors > 3)){
                    var deadCords = {yCord: i, xCord: j};
                    newDead.push(deadCords);
                }
            } else{
                if (livingNeighbors == 3) {
                    var lifeCords = {yCord: i, xCord: j};
                    newLiving.push(lifeCords);
                }
            }
        }
    }
    for (var i = 0; i < newDead.length; i++) {
        var killMe = newDead[i];
        newState.grid[killMe.yCord][killMe.xCord] = 0;
    }
    for (var i = 0; i < newLiving.length; i++) {
        var giveLife = newLiving[i];
        newState.grid[giveLife.yCord][giveLife.xCord] = 1;
    }
    return newState;
  };

  function RandomGameGrid(dim){
    var grid = new Array(dim);
    for (var i = 0; i < dim; i++){
        grid[i] = new Array(dim);
    }
    for (var i = 0; i < dim; i++){
        for(var j = 0; j < dim; j++){
          if (Math.random() < 0.5) {
            grid[i][j] = 1;
          } else {
            grid[i][j] = 0;
          }
        }
    }
    return grid;
  }

  exports.startAnimate = startAnimate;
  exports.stopAnimate = stopAnimate;

})(this)
