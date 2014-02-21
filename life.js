;(function (exports) {

    var draw = function() {
        this.WIDTH = 500;
        this.HEIGHT = 500;

        var canvas = document.getElementById("canvas");
        canvas.width = this.WIDTH;
        canvas.height = this.HEIGHT;
        var context = canvas.getContext("2d");

        var game = new World();
        game.grid[4][4] = 1;
        game.grid[4][5] = 1;
        game.grid[4][6] = 1;
        
        var numRows = game.grid.length;
        console.log("numRows = " + numRows);
        var numCols = game.grid[0].length;
        console.log("numCols = " + numCols);
        var x, y;
        var cellWidth = this.WIDTH/numCols;
        var cellHeight = this.HEIGHT/numRows;

        for (var i = 0; i < numRows; i++) {
            for (var j = 0; j < numCols; j++) {
                y = i*cellWidth;
                x = j*cellHeight;
                if (game.grid[i][j] == 1) {
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
            context.lineTo(this.WIDTH, i*cellHeight); 
            context.stroke();
        }

        // render the vertical grid lines
        for (var j = 0; j <= numCols; j++) {
            context.beginPath();
            context.moveTo(j*cellWidth, 0);
            context.lineTo(j*cellWidth, this.HEIGHT); 
            context.stroke();
        }
        context.strokeStyle = "black";

    };

    exports.draw = draw;

})(this);

var World = function(){
	this.WIDTH = 10;
	this.HEIGHT = 10;
	this.grid = new Array(this.HEIGHT);
	for (var i =0; i<this.HEIGHT; i++){
		this.grid[i] = new Array(this.WIDTH);
		}
	
	for (var i = 0; i<10; i++){
		for(var j =0; j<10;j++){
			this.grid[i][j] =0;
		}
	}

} 

World.prototype.toString = function() {
	for(var i = 0; i<10; i++){
		var row =""
		for(var j = 0; j <10; j++){
			row += this.grid[i][j] + " ";
		}
		console.log(row);
	}
}

World.prototype.update = function () {
	var newLiving = Array();
	var newDead = Array();
	for(var i =0; i<this.HEIGHT; i++){
		for(var j = 0; j<this.WIDTH; j++){
			//this moves through the entire grid
			var currNode = this.grid[i][j];
			var livingNeighbors =0;
			//this nested for loop with traverse the 8 nodes around the currNode
			for(var k = i-1; k<=i+1; k++){
				for(var m = j-1; m<=j+1;m++){
					//this looks for adj node
					if((k <0) || (m<0) || (k>=this.HEIGHT) || (m>=this.WIDTH)){
						continue;
					}
					livingNeighbors += this.grid[k][m];
				}
			}
			if(currNode){
				livingNeighbors--;
			}
			//update life of cell
			if(currNode){
				if((livingNeighbors ==1) || (livingNeighbors>3)){
					var deadCords = {yCord: i, xCord: j};
					newDead.push(deadCords);
				}
			}else{
				if(livingNeighbors ==3) {
					var lifeCords = {yCord: i, xCord: j}
					newLiving.push(lifeCords);
				}
			}
		}
	}
	for(var i = 0; i< newDead.length; i++) {
		var killMe= newDead[i];
		this.grid[killMe.yCord][killMe.xCord] = 0;
	}
	for (var i = 0; i < newLiving.length; i++) {
		var giveLife = newLiving[i];
		this.grid[giveLife.yCord][giveLife.xCord] = 1;
	}
}
