;(function(exports) {

  var gameState;
  var ctx;
  var canvas;
  var intervalId;

  var startAnimate = function() {
    var update = function(){
      gameState = stepGame(gameState);
      renderGrid(ctx, gameState, canvas.width, canvas.height);
    };
    intervalId = setInterval(update, 100);
  };

  var stopAnimate = function() {
    clearInterval(intervalId);
  };

  exports.onload = function() {
    gameState = initGame();
    canvas = document.getElementById("canvas");
    canvas.addEventListener("click", toggleCell, false);
    ctx = canvas.getContext("2d");
    renderGrid(ctx, gameState, canvas.width, canvas.height);
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
    var cellWidth = canvas.width/gameState.dim;
    var cellHeight = canvas.height/gameState.dim;
    var i = Math.floor(y / cellHeight);
    var j = Math.floor(x / cellWidth);
    gameState.grid[i][j] = !(gameState.grid[i][j]);
    renderGrid(ctx, gameState, canvas.width, canvas.height);
  }

  var renderGrid = function(context, gameState, height, width) {
    var numRows = gameState.dim;
    var numCols = gameState.dim;
    var x, y;
    var cellWidth = width/numCols;
    var cellHeight = height/numRows;

    for (var i = 0; i < numRows; i++) {
      for (var j = 0; j < numCols; j++) {
        y = i*cellWidth;
        x = j*cellHeight;
        if (gameState.grid[i][j] == 1) {
          context.fillStyle = "rgb(0, 0, 0)";
        } else {
          context.fillStyle = "rgb(255, 255, 255)";
        }
        context.fillRect(x, y, cellWidth, cellHeight);
      }
    }

    context.strokeStyle = "gray";
    // render the horizontal grid lines
    for (var i = 0; i <= numRows; i++) {
      context.beginPath();
      context.moveTo(0, i*cellHeight);
      context.lineTo(width, i*cellHeight);
      context.stroke();
    }

    // render the vertical grid lines
    for (var j = 0; j <= numCols; j++) {
      context.beginPath();
      context.moveTo(j*cellWidth, 0);
      context.lineTo(j*cellWidth, height);
      context.stroke();
    }
    context.strokeStyle = "black";
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
