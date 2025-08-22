function heuristic(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

function openNeighbors(cell, grid) {
  const result = [];
  const row = cell.row;
  const col = cell.col;
  const walls = cell.walls;

  if (!walls.top && row > 0) result.push(grid[row - 1][col]);
  if (!walls.right && col < grid[0].length - 1) result.push(grid[row][col + 1]);
  if (!walls.bottom && row < grid.length - 1) result.push(grid[row + 1][col]);
  if (!walls.left && col > 0) result.push(grid[row][col - 1]);

  return result;
}

// Runs A* from the top-left cell to the bottom-right cell. Returns the
// final path plus the order cells were visited in, so the search itself
// can be animated as a sweep before the exit route is drawn.
function solveMaze(grid) {
  const start = grid[0][0];
  const goal = grid[grid.length - 1][grid[0].length - 1];

  const key = function (cell) { return cell.row + ',' + cell.col; };

  const open = [start];
  const cameFrom = {};
  const gScore = {};
  const fScore = {};
  const visitedOrder = [];

  grid.forEach(function (row) {
    row.forEach(function (cell) {
      gScore[key(cell)] = Infinity;
      fScore[key(cell)] = Infinity;
    });
  });

  gScore[key(start)] = 0;
  fScore[key(start)] = heuristic(start, goal);

  while (open.length > 0) {
    open.sort(function (a, b) { return fScore[key(a)] - fScore[key(b)]; });
    const current = open.shift();
    visitedOrder.push({ row: current.row, col: current.col });

    if (current === goal) {
      const path = [];
      let node = current;
      while (node) {
        path.unshift({ row: node.row, col: node.col });
        node = cameFrom[key(node)];
      }
      return { path: path, visitedOrder: visitedOrder };
    }

    openNeighbors(current, grid).forEach(function (neighbor) {
      const tentative = gScore[key(current)] + 1;
      if (tentative < gScore[key(neighbor)]) {
        cameFrom[key(neighbor)] = current;
        gScore[key(neighbor)] = tentative;
        fScore[key(neighbor)] = tentative + heuristic(neighbor, goal);
        if (open.indexOf(neighbor) === -1) {
          open.push(neighbor);
        }
      }
    });
  }

  return { path: [], visitedOrder: visitedOrder };
}

window.Maze = window.Maze || {};
window.Maze.solveMaze = solveMaze;
