(function () {
  const ROWS = 18;
  const COLS = 28;

  const canvas = document.getElementById('maze-canvas');
  const statusEl = document.getElementById('status');
  const regenerateBtn = document.getElementById('regenerate');
  const solveBtn = document.getElementById('solve');
  const speedInput = document.getElementById('speed');

  const renderer = window.Maze.createRenderer(canvas, ROWS, COLS);

  let grid = null;
  let timer = null;

  function stopTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function drawHighlighted(cells, color) {
    renderer.clear();
    if (cells) {
      cells.forEach(function (cell) {
        renderer.drawCellFill(cell, color);
      });
    }
    renderer.drawWalls(grid);
  }

  function buildMaze() {
    stopTimer();
    setStatus('CARVING SECTOR...');

    const result = window.Maze.generateMaze(ROWS, COLS);
    const steps = result.steps;

    // Start from a fully walled grid and open passages as the steps
    // play back, so the carving actually animates instead of appearing
    // all at once.
    grid = window.Maze.createGrid(ROWS, COLS);

    let i = 0;
    const perTick = Math.max(1, Math.floor(steps.length / 120));

    timer = setInterval(function () {
      for (let n = 0; n < perTick && i < steps.length; n++, i++) {
        const step = steps[i];
        grid[step.from.row][step.from.col].walls[step.from.dir] = false;
        grid[step.to.row][step.to.col].walls[step.to.dir] = false;
      }

      renderer.clear();
      renderer.drawWalls(grid);

      if (i >= steps.length) {
        stopTimer();
        grid = result.grid;
        renderer.clear();
        renderer.drawWalls(grid);
        setStatus('SECTOR READY. PRESS CALCULATE ROUTE.');
      }
    }, 16);
  }

  function runSolve() {
    if (!grid) return;
    stopTimer();
    setStatus('SCANNING FOR EXIT ROUTE...');

    const result = window.Maze.solveMaze(grid);
    const visited = result.visitedOrder;
    const path = result.path;

    let i = 0;
    const intervalMs = Math.max(5, 60 - parseInt(speedInput.value, 10));

    timer = setInterval(function () {
      i++;
      drawHighlighted(visited.slice(0, i), 'rgba(242, 181, 68, 0.35)');

      if (i >= visited.length) {
        stopTimer();
        drawHighlighted(path, 'rgba(61, 220, 132, 0.85)');
        setStatus(path.length > 0
          ? 'ROUTE LOCKED. ' + path.length + ' CELLS TO EXIT.'
          : 'NO ROUTE FOUND.');
      }
    }, intervalMs);
  }

  regenerateBtn.addEventListener('click', buildMaze);
  solveBtn.addEventListener('click', runSolve);

  buildMaze();
})();
