let matrix = [
    ['*', '*', '*', ' ', '*', '*', '*'],
	[' ', ' ', '*', ' ', ' ', '*', '*'],
	['*', ' ', '*', '*', ' ', ' ', '*'],
	['*', ' ', ' ', '*', '*', ' ', '*'],
	['*', '*', ' ', 's', ' ', ' ', '*'],
	['*', '*', '*', ' ', '*', ' ', ' '],
	['*', ' ', ' ', ' ', '*', '*', '*'],
	['*', ' ', '*', '*', '*', '*', '*'],
	['*', ' ', '*', '*', '*', '*', '*'],
];

let start = findStart();
let visited = new Array(matrix.length);
let previousPosition = new Array(matrix.length);
let currentPosition = {row: 0, col: 0};
let steps = 0;
let exitFound = false;

findExits();

for(let i = 0; i < visited.length; i++){
    visited[i] = [];
    for(let j = 0; j < matrix[i].length; j++){
        visited[i][j] = 0;
    }
}

visited[start.row][start.col] = 1;

for(let i = 0; i < previousPosition.length; i++){
    previousPosition[i] = [];
    for(let j = 0; j < matrix[i].length; j++){
        previousPosition[i][j] = ({row:0, col:0});
    }
}

let queue = [start];

while(queue.length > 0){
    var element = queue.shift();
    
    if(!(element.row + 1 >= matrix.length)){
        addNeighbours({row: element.row + 1, col: element.col}, queue, visited, previousPosition, matrix, {row: element.row, col: element.col});
        if(exitFound){
            break;
        }
    }

    if(!(element.col + 1 >= matrix[0].length)){
        addNeighbours({row: element.row, col: element.col + 1}, queue, visited, previousPosition, matrix, {row: element.row, col: element.col});
        if(exitFound){
            break;
        }
    }

    if(!(element.row - 1 < 0)){
        addNeighbours({row: element.row - 1, col: element.col}, queue, visited, previousPosition, matrix, {row: element.row, col: element.col});
        if(exitFound){
            break;
        }
    }

    if(!(element.col - 1 < 0)){
        addNeighbours({row: element.row, col: element.col - 1}, queue, visited, previousPosition, matrix, {row: element.row, col: element.col});
        if(exitFound){
            break;
        }
    }
}


while(!(currentPosition.row == start.row && currentPosition.col == start.col) && exitFound){
    let currentRow = currentPosition.row;
    let currentCol = currentPosition.col;

    matrix[previousPosition[currentRow][currentCol].row][previousPosition[currentRow][currentCol].col] = 't';
    steps++;
    currentPosition = {row: previousPosition[currentRow][currentCol].row, col: previousPosition[currentRow][currentCol].col};
}

printLabyrinth();

function addNeighbours(position, queue, visited, previousPosition, matrix, olderPosition){
    if(visited[position.row][position.col] == 0 && matrix[position.row][position.col] != '*'){
        queue.push({row: position.row, col: position.col});
        visited[position.row][position.col] = 1;
        previousPosition[position.row][position.col] = {row: olderPosition.row, col: olderPosition.col};
        if(matrix[position.row][position.col] == 'e'){
            currentPosition = {row: position.row, col: position.col};
            matrix[currentPosition.row][currentPosition.col] = 't';
            steps++;
            exitFound = true;
        }
    }
}

function printLabyrinth(){
    for(let i = 0; i < matrix.length; i++){
        let row = "";
        for(let j = 0; j < matrix[i].length; j++){
            row += matrix[i][j];
            row += ' ';
        }
        console.log(row);
    }

    if(exitFound){
        console.log("Out of the labyrinth in " + steps + " steps");
    }

    else{
        console.log("No exit found")
    }
}

function findStart(){
    for(let i = 0; i < matrix.length; i++){
        let rowLength = matrix[0].length;
        for(let j = 0; j < rowLength; j++){
            if(matrix[i][j] == 's'){
                return{row: i, col: j};
            }
        }
    }
}

function findExits(){
    for(let i = 0; i < matrix.length; i++){
        let rowLength = matrix[0].length;
        for(let j = 0; j < rowLength; j++){
            if((i == 0 || i == matrix.length - 1 || j == 0 || j == rowLength - 1) && matrix[i][j] == ' ' && matrix[i][j] != 's'){
                matrix[i][j] = 'e';
            }
        }
    }
}