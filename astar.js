// -> Created by Eduardo Spaki

function Grid(cols, rows) {
    this.items = new Array(cols);
    this.cols = cols;
    this.rows = rows;

    for (var i = 0; i < cols; i++)
        this.items[i] = new Array(rows);
}

function Cell(grid, i, j, blocked) {
    this.grid = grid;

    this.i = i;
    this.j = j;

    this.f = 0;
    this.g = 0;
    this.h = 0;

    this.blocked = blocked;
    this.previous;
    this.neighbors = new Array();

    this.generateNeighbords = function () {
        // -> right
        if(this.i < this.grid.cols - 1) {
            addInArray(this.neighbors, this.grid.items[this.i + 1][this.j]);
        }
        
        // -> left
        if(this.i > 0) {
            addInArray(this.neighbors, this.grid.items[this.i - 1][this.j]);
        }

        // -> down
        if(this.j < this.grid.rows - 1) {
            addInArray(this.neighbors, this.grid.items[this.i][this.j + 1]);
        }

        // -> up
        if(this.j > 0) {
            addInArray(this.neighbors, this.grid.items[this.i][this.j - 1]);
        }



        // -> left up diagonal
        if(this.i > 0 && this.j > 0) {
            addInArray(this.neighbors, this.grid.items[this.i - 1][this.j - 1]);
        }

        // -> right up diagonal
        if(this.i < this.grid.cols - 1 && this.j > 0) {
            addInArray(this.neighbors, this.grid.items[this.i + 1][this.j - 1]);
        }

        // -> left down diagonal
        if(this.i > 0 && this.j < this.grid.rows - 1) {
            addInArray(this.neighbors, this.grid.items[this.i - 1][this.j + 1]);
        }

        // -> right down diagonal
        if(this.i < this.grid.cols - 1 && this.j < grid.rows -1) {
            addInArray(this.neighbors, this.grid.items[this.i + 1][this.j + 1]);
        }
    }
}

function InterationResult() {
    this.currentNode = null;
    this.finished = false;
    this.hasSolution = false;

    this.getPath = function() {
        var result = new Array();
        
        var temp = this.currentNode;
        
        if(temp)
            addInArray(result, temp);
        
        while (temp && temp.previous) {
            temp = temp.previous;

            if(temp)
                addInArray(result, temp);
        }

        return result;
    }
}

function AStarEngine(startNode) {
    this.openSet = new Array();
    this.closedSet = new Array();

    addInArray(this.openSet, startNode);

    this.interate = function (target) {
        var result = new InterationResult();
    
        if(this.openSet.length > 0) { // -> keep going
        
            var winner = 0;
    
            for (var i = 0; i < this.openSet.length; i++) 
                if(this.openSet[i].f < this.openSet[winner].f)
                    winner = i;
    
            result.currentNode = this.openSet[winner];
            result.finished = result.hasSolution = result.currentNode == target;// -> solution found!
            
            removeFromArray(this.openSet, result.currentNode);
            addInArray(this.closedSet, result.currentNode);
    
            for (var i = 0; i < result.currentNode.neighbors.length; i++) { 
                var neighbor = result.currentNode.neighbors[i];
    
                if(!this.closedSet.includes(neighbor) && !neighbor.blocked) // -> check if it is blocked also
                {
                    var tempG = result.currentNode.g + 1;
                    var newPath = false;
    
                    if(this.openSet.includes(neighbor))
                    {
                        if(tempG < neighbor.g){
                            neighbor.g = tempG;
                            newPath = true;
                        }
                    } else {
                        neighbor.g = tempG;
                        newPath = true;
                        addInArray(this.openSet, neighbor);
                    }
    
                    if(newPath) {
                        neighbor.h = this.heuristic(neighbor, target);
                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.previous = result.currentNode;
                    }
                }
            }
        } else { 
            result.finished = true; // -> no solution
        }
    
        return result;
    }
    
    this.heuristic = function (currentNode, endNode) {
        var distance = dist(currentNode.i, currentNode.j, endNode.i, endNode.j);
        //var distance = abs(currentNode.i - currentNode.j) +  abs(endNode.i - endNode.j);
        return distance;
    }
}