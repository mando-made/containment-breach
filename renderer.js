function createRenderer(canvas, rows, cols) {
  const ctx = canvas.getContext('2d');
  const cellSize = Math.min(canvas.width / cols, canvas.height / rows);

  function clear() {
    ctx.fillStyle = '#0c0f0d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawCellFill(cell, color) {
    ctx.fillStyle = color;
    ctx.fillRect(cell.col * cellSize, cell.row * cellSize, cellSize, cellSize);
  }

  function drawWalls(grid) {
    ctx.strokeStyle = '#3a4a3f';
    ctx.lineWidth = 2;

    grid.forEach(function (row) {
      row.forEach(function (cell) {
        const x = cell.col * cellSize;
        const y = cell.row * cellSize;

        ctx.beginPath();
        if (cell.walls.top) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + cellSize, y);
        }
        if (cell.walls.right) {
          ctx.moveTo(x + cellSize, y);
          ctx.lineTo(x + cellSize, y + cellSize);
        }
        if (cell.walls.bottom) {
          ctx.moveTo(x, y + cellSize);
          ctx.lineTo(x + cellSize, y + cellSize);
        }
        if (cell.walls.left) {
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + cellSize);
        }
        ctx.stroke();
      });
    });
  }

  return {
    clear: clear,
    drawCellFill: drawCellFill,
    drawWalls: drawWalls,
    cellSize: cellSize
  };
}

window.Maze = window.Maze || {};
window.Maze.createRenderer = createRenderer;
