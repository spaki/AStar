// -> Created by Eduardo Spaki

var percentOfBlockedItens = 0.3;

var grid;
var engine;

var targetNode;

function setup() {
    createCanvas(500, 500);

    grid = new Grid(50, 50);

    // -> build grid cells
    for (var i = 0; i < grid.cols; i++)  
        for (var j = 0; j < grid.rows; j++) 
            grid.items[i][j] = new Cell(grid, i, j, isBlocked());

    // -> build grid relationships
    for (var i = 0; i < grid.cols; i++) 
        for (var j = 0; j < grid.rows; j++) 
            grid.items[i][j].generateNeighbords();

    // -> define start and end
    var startNode = grid.items[0][0];
    targetNode = grid.items[grid.cols - 1][grid.rows - 1];

    startNode.blocked = false;
    targetNode.blocked = false;

    engine = new AStarEngine(startNode);
}

function draw() {
    var interationResult = engine.interate(targetNode);

    if(interationResult.finished) {
        noLoop();

        if(!interationResult.hasSolution)
            return;
    }

    // -> dark grid background
    background(0);

    // -> draw the white grid cells
    for (var i = 0; i < grid.cols; i++) 
        for (var j = 0; j < grid.rows; j++) 
            printCell(grid.items[i][j], color(255));

    for (var i = 0; i < engine.closedSet.length; i++) 
        printCell(engine.closedSet[i], color(255, 0, 0)); // -> red for invalid paths

    for (var i = 0; i < engine.openSet.length; i++) 
        printCell(engine.openSet[i], color(0, 255, 0)); // -> green for open attempts

    // -> print the path
    var path = interationResult.getPath();

    for (var i = 0; i < path.length; i++) 
        printCell(path[i], color(0, 0, 255)); // -> blue for the path
}

// -> aux
function isBlocked() {
    return random(1) < percentOfBlockedItens;
}

function printCell(cell, color) {
    fill(color);

    if(cell.blocked)
        fill(0);

    noStroke();

    var w = width/grid.cols;
    var h = height/grid.rows;
    rect(cell.i * w, cell.j * h, w - 1, h - 1);
}