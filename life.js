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
	
}


var game = new World();
	