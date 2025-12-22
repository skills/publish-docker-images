// Game constants
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const PATTERN_SIZE = 5;

// Colors for blocks (dev-themed)
const COLORS = {
  0: "#252526", // Empty
  1: "#f48771", // Bug red
  2: "#4ec9b0", // Function cyan
  3: "#ce9178", // String orange
  4: "#c586c0", // Class purple
  5: "#dcdcaa", // Variable yellow
  6: "#569cd6", // Keyword blue
  7: "#b5cea8", // Number green
  8: "#000000", // Void (black)
};

// Tetromino shapes (simplified for easier pattern matching)
const SHAPES = [
  [[1]], // Single block
  [[2, 2]], // Horizontal pair
  [[3], [3]], // Vertical pair
  [
    [4, 4],
    [4, 4],
  ], // 2x2 square
  [[5, 5, 5]], // Horizontal line of 3
  [[8]], // Void block (black)
  [[8, 8]], // Void pair
];

// Game state
let canvas, ctx, patternCanvas, patternCtx;
let board = [];
let currentPiece = null;
let currentX = 0;
let currentY = 0;
let score = 0;
let gameOver = false;
let isPaused = false;
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let targetPattern = null;

// Initialize game
function init() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  patternCanvas = document.getElementById("patternCanvas");
  patternCtx = patternCanvas.getContext("2d");

  // Initialize empty board
  board = Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(0));

  // Set initial target pattern
  setNewTargetPattern();

  // Spawn first piece
  spawnPiece();

  // Start game loop
  requestAnimationFrame(gameLoop);

  // Add keyboard controls
  document.addEventListener("keydown", handleKeyPress);
}

// Game loop
function gameLoop(time = 0) {
  if (!gameOver && !isPaused) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
      moveDown();
      dropCounter = 0;
    }
  }

  draw();
  requestAnimationFrame(gameLoop);
}

// Draw everything
function draw() {
  // Clear canvas
  ctx.fillStyle = COLORS[0];
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw board
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col]) {
        drawBlock(ctx, col, row, board[row][col]);
      }
    }
  }

  // Draw current piece
  if (currentPiece) {
    drawPiece(ctx, currentPiece, currentX, currentY);
  }

  // Draw grid
  ctx.strokeStyle = "#3e3e42";
  ctx.lineWidth = 0.5;
  for (let row = 0; row <= ROWS; row++) {
    ctx.beginPath();
    ctx.moveTo(0, row * BLOCK_SIZE);
    ctx.lineTo(COLS * BLOCK_SIZE, row * BLOCK_SIZE);
    ctx.stroke();
  }
  for (let col = 0; col <= COLS; col++) {
    ctx.beginPath();
    ctx.moveTo(col * BLOCK_SIZE, 0);
    ctx.lineTo(col * BLOCK_SIZE, ROWS * BLOCK_SIZE);
    ctx.stroke();
  }
}

// Draw a single block
function drawBlock(context, x, y, colorCode) {
  context.fillStyle = COLORS[colorCode];
  context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  context.strokeStyle = "#1e1e1e";
  context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

// Draw current piece
function drawPiece(context, piece, offsetX, offsetY) {
  for (let row = 0; row < piece.length; row++) {
    for (let col = 0; col < piece[row].length; col++) {
      if (piece[row][col]) {
        drawBlock(context, offsetX + col, offsetY + row, piece[row][col]);
      }
    }
  }
}

// Spawn new piece
function spawnPiece() {
  const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  currentPiece = randomShape.map((row) => [...row]);
  currentX = Math.floor(COLS / 2) - Math.floor(currentPiece[0].length / 2);
  currentY = 0;

  if (checkCollision(currentPiece, currentX, currentY)) {
    endGame();
  }
}

// Check collision
function checkCollision(piece, x, y) {
  for (let row = 0; row < piece.length; row++) {
    for (let col = 0; col < piece[row].length; col++) {
      if (piece[row][col]) {
        const newX = x + col;
        const newY = y + row;

        if (newX < 0 || newX >= COLS || newY >= ROWS) {
          return true;
        }

        if (newY >= 0 && board[newY][newX]) {
          return true;
        }
      }
    }
  }
  return false;
}

// Move piece down
function moveDown() {
  if (!checkCollision(currentPiece, currentX, currentY + 1)) {
    currentY++;
  } else {
    lockPiece();
    checkPatternMatch();
    spawnPiece();
  }
}

// Lock piece to board
function lockPiece() {
  for (let row = 0; row < currentPiece.length; row++) {
    for (let col = 0; col < currentPiece[row].length; col++) {
      if (currentPiece[row][col]) {
        const boardY = currentY + row;
        const boardX = currentX + col;
        if (boardY >= 0) {
          board[boardY][boardX] = currentPiece[row][col];
        }
      }
    }
  }
}

// Rotate piece
function rotate() {
  const rotated = currentPiece[0].map((_, i) => currentPiece.map((row) => row[i]).reverse());

  if (!checkCollision(rotated, currentX, currentY)) {
    currentPiece = rotated;
  }
}

// Move left
function moveLeft() {
  if (!checkCollision(currentPiece, currentX - 1, currentY)) {
    currentX--;
  }
}

// Move right
function moveRight() {
  if (!checkCollision(currentPiece, currentX + 1, currentY)) {
    currentX++;
  }
}

// Hard drop
function hardDrop() {
  while (!checkCollision(currentPiece, currentX, currentY + 1)) {
    currentY++;
  }
  lockPiece();
  checkPatternMatch();
  spawnPiece();
}

// Set new target pattern
function setNewTargetPattern() {
  targetPattern = ERROR_PATTERNS[Math.floor(Math.random() * ERROR_PATTERNS.length)];
  drawTargetPattern();
  document.getElementById("patternName").textContent = targetPattern.name;
}

// Draw target pattern
function drawTargetPattern() {
  if (!targetPattern) return;

  const blockSize = 20;
  patternCtx.fillStyle = "#1e1e1e";
  patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);

  for (let row = 0; row < PATTERN_SIZE; row++) {
    for (let col = 0; col < PATTERN_SIZE; col++) {
      if (targetPattern.pattern[row][col]) {
        patternCtx.fillStyle = "#f48771";
        patternCtx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
        patternCtx.strokeStyle = "#3e3e42";
        patternCtx.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize);
      }
    }
  }
}

// Check for pattern match
function checkPatternMatch() {
  for (let startRow = 0; startRow <= ROWS - PATTERN_SIZE; startRow++) {
    for (let startCol = 0; startCol <= COLS - PATTERN_SIZE; startCol++) {
      if (matchesPattern(startRow, startCol)) {
        clearPattern(startRow, startCol);
        score += 100;
        updateScore();
        setNewTargetPattern();
        return;
      }
    }
  }
}

// Check if pattern matches at position
function matchesPattern(startRow, startCol) {
  for (let row = 0; row < PATTERN_SIZE; row++) {
    for (let col = 0; col < PATTERN_SIZE; col++) {
      const cellValue = board[startRow + row][startCol + col];
      // Void blocks (8) count as empty for pattern matching
      const hasBlock = cellValue !== 0 && cellValue !== 8;
      const needsBlock = targetPattern.pattern[row][col] === 1;

      if (hasBlock !== needsBlock) {
        return false;
      }
    }
  }
  return true;
}

// Clear matched pattern
function clearPattern(startRow, startCol) {
  // Clear all blocks on the board
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      board[row][col] = 0;
    }
  }
}

// Update score display
function updateScore() {
  document.getElementById("score").textContent = score;
}

// Handle keyboard input
function handleKeyPress(e) {
  if (gameOver) return;

  switch (e.key) {
    case "ArrowLeft":
      e.preventDefault();
      if (!isPaused) moveLeft();
      break;
    case "ArrowRight":
      e.preventDefault();
      if (!isPaused) moveRight();
      break;
    case "ArrowDown":
      e.preventDefault();
      if (!isPaused) moveDown();
      break;
    case "ArrowUp":
      e.preventDefault();
      if (!isPaused) rotate();
      break;
    case " ":
      e.preventDefault();
      if (!isPaused) hardDrop();
      break;
    case "p":
    case "P":
      e.preventDefault();
      togglePause();
      break;
  }
}

// Toggle pause
function togglePause() {
  isPaused = !isPaused;
  document.getElementById("status").textContent = isPaused ? "Paused" : "Playing...";
}

// End game
function endGame() {
  gameOver = true;
  document.getElementById("finalScore").textContent = score;
  document.getElementById("gameOver").classList.add("show");
}

// Start the game when page loads
window.addEventListener("load", init);
