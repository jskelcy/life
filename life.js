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
	console.log("idk");
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
					if((k <0) || (m<0) || (k>=this.HEIGHT) || (m>=this.WIDTH) ){
						continue;
					}
					livingNeighbors += this.grid[k][m];
					if(currNode){
						livingNeighbors--;
					}
				}
			}
			//update life of cell
			if(currNode){
				if((livingNeighbors ==1) || (livingNeighbors>3)){
					newDead.push([i, j]);
				}
			}else{
				if(livingNeighbors ==3) {
					newLiving.push([i, j]);
				}
			}
		}
	}	
	console.log("newDead.length = " + newDead.length)
	console.log("newDead.length = " + newLiving.length)
	for (var i = 0; i < newDead.length; i++) {
		var ij = newDead[i];
		console.log("i, j = " + ij[0] + ", " + ij[1]);
		this.grid[ij[0]][ij[1]] = 0;
	}
	for (var i = 0; i < newLiving.length; i++) {
		console.log(ij);
		var ij = newLiving[i];
		this.grid[ij[0]][ij[1]] = 0;
	}
}


var game = new World();
game.grid[4][4] = 1;
game.grid[4][5] = 1;
game.grid[4][6] = 1;

	
console.log(game.toString());
game.update();
console.log(game.toString());