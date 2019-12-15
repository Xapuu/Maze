let template = document.getElementById("id");
let animation = document.getElementById("animation");

const maze = [
  ["*", "*", "*", " ", "*", "*", "*"],
  ["*", " ", "*", " ", " ", "*", "*"],
  ["*", " ", "*", "*", " ", " ", " "],
  ["*", " ", " ", "*", " ", "*", "*"],
  ["*", " ", " ", " ", " ", "*", "*"],
  ["*", "*", "*", " ", "*", "*", "*"],
  ["*", " ", " ", " ", "*", "*", "*"],
  ["*", " ", "*", "*", "*", "*", "*"],
  ["*", " ", "*", "*", "*", "*", "*"]
];

let size = 50;
let height = maze.length;
let width = maze[0].length;
let clickCounter = 0;
let startingPointC = {
  x: null,
  y: null
};

let lastStartingPointRef;

let canvas = document.createElementNS("http://www.w3.org/2000/svg", "svg");
canvas.setAttribute("width", width * size);
canvas.setAttribute("height", height * size);

let appendElement = (canvas, node, maze) => {
  let colors = {
    "*": "gray",
    " ": "green",
    s: "yellow",
    t: "orange"
  };

  if (maze[node.y][node.x] === "*") {
    let blockRef = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    blockRef.setAttribute("height", size);
    blockRef.setAttribute("width", size);
    blockRef.setAttribute("x", node.x * size);
    blockRef.setAttribute("y", node.y * size);
    blockRef.setAttribute("fill", colors["*"]);

    canvas.appendChild(blockRef);
  } else if (maze[node.y][node.x] === " " || maze[node.y][node.x] === "e") {
    let blockRef = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );

    blockRef.setAttribute("height", size);
    blockRef.setAttribute("width", size);
    blockRef.setAttribute("x", node.x * size);
    blockRef.setAttribute("y", node.y * size);
    blockRef.setAttribute("fill", colors[" "]);

    canvas.appendChild(blockRef);

    blockRef.addEventListener("click", function() {
      blockRef.setAttribute("fill", colors["s"]);

      if (startingPointC.x !== null) {
        maze[startingPointC.y][startingPointC.x] = " ";
        lastStartingPointRef.setAttribute("fill", colors[" "]);
      }

      maze[node.y][node.x] = "s";

      startingPointC.x = node.x;
      startingPointC.y = node.y;

      lastStartingPointRef = blockRef;

      var startPosition = { row: node.y, col: node.x };
    });
  } else if (maze[node.y][node.x] === "s") {
    let blockRef = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );

    blockRef.setAttribute("height", size);
    blockRef.setAttribute("width", size);
    blockRef.setAttribute("x", node.x * size);
    blockRef.setAttribute("y", node.y * size);
    blockRef.setAttribute("fill", colors["s"]);

    canvas.appendChild(blockRef);
  } else if (maze[node.y][node.x] === "t") {
    let blockRef = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );

    blockRef.setAttribute("height", size);
    blockRef.setAttribute("width", size);
    blockRef.setAttribute("x", node.x * size);
    blockRef.setAttribute("y", node.y * size);
    blockRef.setAttribute("fill", colors["t"]);

    canvas.appendChild(blockRef);
  }
};

maze.map((row, y, arr) => {
  row.map((col, x) => {
    appendElement(canvas, { x, y }, maze);
  });
});

template.appendChild(canvas);

let button = document.getElementById("find");

button.addEventListener("click", () => {
  findShortestPath();
});

template.appendChild(canvas);

function findShortestPath() {
  let visited = new Array(maze.length);
  let previousPosition = new Array(maze.length);
  let currentPosition = { row: 0, col: 0 };
  let steps = 0;
  let exitFound = false;

  findExits();

  for (let i = 0; i < visited.length; i++) {
    visited[i] = [];
    for (let j = 0; j < maze[i].length; j++) {
      visited[i][j] = 0;
    }
  }

  visited[startPosition.row][startPosition.col] = 1;

  for (let i = 0; i < previousPosition.length; i++) {
    previousPosition[i] = [];
    for (let j = 0; j < maze[i].length; j++) {
      previousPosition[i][j] = { row: 0, col: 0 };
    }
  }

  let queue = [start];

  while (queue.length > 0) {
    var element = queue.shift();

    if (!(element.row + 1 >= maze.length)) {
      addNeighbours(
        { row: element.row + 1, col: element.col },
        queue,
        visited,
        previousPosition,
        maze,
        { row: element.row, col: element.col }
      );
      if (exitFound) {
        break;
      }
    }

    if (!(element.col + 1 >= maze[0].length)) {
      addNeighbours(
        { row: element.row, col: element.col + 1 },
        queue,
        visited,
        previousPosition,
        maze,
        { row: element.row, col: element.col }
      );
      if (exitFound) {
        break;
      }
    }

    if (!(element.row - 1 < 0)) {
      addNeighbours(
        { row: element.row - 1, col: element.col },
        queue,
        visited,
        previousPosition,
        maze,
        { row: element.row, col: element.col }
      );
      if (exitFound) {
        break;
      }
    }

    if (!(element.col - 1 < 0)) {
      addNeighbours(
        { row: element.row, col: element.col - 1 },
        queue,
        visited,
        previousPosition,
        maze,
        { row: element.row, col: element.col }
      );
      if (exitFound) {
        break;
      }
    }
  }

  while (
    !(
      currentPosition.row == startPosition.row &&
      currentPosition.col == startPosition.col
    ) &&
    exitFound
  ) {
    let currentRow = currentPosition.row;
    let currentCol = currentPosition.col;

    maze[previousPosition[currentRow][currentCol].row][
      previousPosition[currentRow][currentCol].col
    ] = "t";
    steps++;
    currentPosition = {
      row: previousPosition[currentRow][currentCol].row,
      col: previousPosition[currentRow][currentCol].col
    };
  }

  function addNeighbours(
    position,
    queue,
    visited,
    previousPosition,
    maze,
    olderPosition
  ) {
    if (
      visited[position.row][position.col] == 0 &&
      maze[position.row][position.col] != "*"
    ) {
      queue.push({ row: position.row, col: position.col });
      visited[position.row][position.col] = 1;
      previousPosition[position.row][position.col] = {
        row: olderPosition.row,
        col: olderPosition.col
      };
      if (maze[position.row][position.col] == "e") {
        currentPosition = { row: position.row, col: position.col };
        maze[currentPosition.row][currentPosition.col] = "t";
        steps++;
        exitFound = true;
      }
    }
  }

  function findExits() {
    for (let i = 0; i < maze.length; i++) {
      let rowLength = maze[0].length;
      for (let j = 0; j < rowLength; j++) {
        if (
          (i == 0 || i == maze.length - 1 || j == 0 || j == rowLength - 1) &&
          maze[i][j] == " " &&
          maze[i][j] != "s"
        ) {
          maze[i][j] = "e";
        }
      }
    }
  }
}
