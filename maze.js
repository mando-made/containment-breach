function createGrid(rows, cols) {
  const grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        visited: false,
        walls: { top: true, right: true, bottom: true, left: true }
      });
    }
    grid.push(row);
  }
  return grid;
}

function getNeighbors(cell, grid) {
  const row = cell.row;
  const col = cell.col;
  const neighbors = [];

  const candidates = [
    { dir: 'top', dr: -1, dc: 0, opposite: 'bottom' },
    { dir: 'right', dr: 0, dc: 1, opposite: 'left' },
    { dir: 'bottom', dr: 1, dc: 0, opposite: 'top' },
    { dir: 'left', dr: 0, dc: -1, opposite: 'right' }
  ];

  candidates.forEach(function (c) {
    const nr = row + c.dr;
    const nc = col + c.dc;
    if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length) {
      const neighbor = grid[nr][nc];
      if (!neighbor.visited) {
        neighbors.push({ cell: neighbor, dir: c.dir, opposite: c.opposite });
      }
    }
  });

  return neighbors;
}

// Generates a maze with recursive backtracking. Returns the finished
// grid plus an ordered list of carving steps (with which wall was
// opened on each side), so the caller can replay the carving frame by
// frame instead of drawing the finished maze all at once.
function generateMaze(rows, cols) {
  const grid = createGrid(rows, cols);
  const steps = [];
  const stack = [];

  let current = grid[0][0];
  current.visited = true;
  stack.push(current);

  while (stack.length > 0) {
    current = stack[stack.length - 1];
    const neighbors = getNeighbors(current, grid);

    if (neighbors.length === 0) {
      stack.pop();
      continue;
    }

    const chosen = neighbors[Math.floor(Math.random() * neighbors.length)];
    const next = chosen.cell;

    current.walls[chosen.dir] = false;
    next.walls[chosen.opposite] = false;
    next.visited = true;

    steps.push({
      from: { row: current.row, col: current.col, dir: chosen.dir },
      to: { row: next.row, col: next.col, dir: chosen.opposite }
    });

    stack.push(next);
  }

  return { grid: grid, steps: steps };
}

window.Maze = window.Maze || {};
window.Maze.createGrid = createGrid;
window.Maze.generateMaze = generateMaze;
