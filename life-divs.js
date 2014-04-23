;(function(exports) {

  var gameState;
  var gameGrid;
  var ctx;
  var intervalId;

  var startAnimate = function() {
    var update = function(){
      gameState = stepGame(gameState);
      renderGrid(gameState);
    };
    intervalId = setInterval(update, 100);
  };

  var stopAnimate = function() {
    clearInterval(intervalId);
  };

  exports.onload = function() {
    gameState = initGame();
    gameGrid = document.getElementById("grid");
    // add 50 child divs for each row, with row ids 0-49
    for (var row = 0; row < gameState.dim; row ++) {
      var rowDiv = document.createElement('div');
      rowDiv.id = "r" + row;
      // for each row div, add 50 child divs for each column, with column ids 0-49
      for (var col = 0; col < gameState.dim; col ++) {
        var rowColDiv = document.createElement('div');
        rowColDiv.id = rowDiv.id + "c" + col;
        rowColDiv.height = 10;
        rowColDiv.width = 10;
        rowColDiv["border-color"] = "black";
        // TODO is this field on the div actually necessary?
        // I don't seem to be using it right now :-/
        rowColDiv.valObj = gameState.grid[row][col];
        rowDiv.appendChild(rowColDiv);
      }
      gameGrid.appendChild(rowDiv);
    }
    // TODO add event listeners to divs
    renderGrid(gameState);
  };

  var initGame = function() {
    return(
      {
      dim: 50,
      grid: RandomGameGrid(50)
    }
    );
  };

  var renderGrid = function(gameState) {
    var row, col, cellId, rowColDiv;

    for (row = 0; i < gameState.dim; row ++) {
      for (col = 0; j < gameState.dim; col ++) {
        cellId = "r" + row + "c" + col;
        rowColDiv = document.getElementById(cellId);
        if (gameState.grid[i][j].val == 1) {
          rowColDiv["background-color"] = "rgb(0, 0, 0)";
        } else {
          rowColDiv["background-color"] = "rgb(255, 255, 255)";
        }
      }
    }

  };


  var stepGame = function(gameState) {
    var newState = initGame(),
        newLiving = Array(),
        newDead = Array(), i, j, k, m;
    newState.grid = gameState.grid;
    for(i = 0; i < gameState.dim; i++){
        for(j = 0; j < gameState.dim; j++){
            //this moves through the entire grid
            var currNode = gameState.grid[i][j];
            var livingNeighbors = 0;
            //traverse the 8 cells around the current cell
            for(k = i - 1; k <= i + 1; k ++){
                for(m = j - 1; m <= j + 1; m ++){
                    //this looks for adj node
                    if((k < 0) || (m < 0) || (k >= gameState.dim) || (m >= gameState.dim)){
                        continue;
                    }
                    livingNeighbors += gameState.grid[k][m].val;
                }
            }
            if(currNode.val){
                livingNeighbors--;
            }
            //update life of cell
            if (currNode.val){
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
    for (i = 0; i < newDead.length; i++) {
        var killMe = newDead[i];
        newState.grid[killMe.yCord][killMe.xCord].val = 0;
    }
    for (i = 0; i < newLiving.length; i++) {
        var giveLife = newLiving[i];
        newState.grid[giveLife.yCord][giveLife.xCord].val = 1;
    }
    return newState;
  };

  function RandomGameGrid(dim){
    var grid = new Array(dim), i;
    for (i = 0; i < dim; i++){
        grid[i] = new Array(dim);
    }
    for (i = 0; i < dim; i++){
        for(var j = 0; j < dim; j++){
          if (Math.random() < 0.5) {
            grid[i][j] = {val:0};
          } else {
            grid[i][j] = {val:1};
          }
        }
    }
    return grid;
  }

  exports.startAnimate = startAnimate;
  exports.stopAnimate = stopAnimate;

})(this);
