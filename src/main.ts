import { Board } from './board.js';
import { accountValuesInterface, canvasTextParamsInterface } from './interfaces.js';
import { KEY, BLOCK_SIZE, POINTS, LEVEL, BASIC_MOVES, CANVAS_TEXT } from './constants.js';

const canvas = <HTMLCanvasElement>document.querySelector('#board');
const ctx = canvas.getContext('2d');
const canvasNext = <HTMLCanvasElement>document.querySelector('#next');
const ctxNext = canvasNext.getContext('2d');

let time;

const accountValues: accountValuesInterface = {
  score: 0,
  level: 0,
  lines: 0
}

function updateAccount(key: string, value: number) {
  const element = <HTMLElement>document.querySelector(`#${key}`);
  if (element) element.textContent = value.toString();
}

let account: accountValuesInterface = new Proxy(accountValues, {
  set: (target: accountValuesInterface, key: string, value: number): boolean => {
    target[key] = value;
    updateAccount(key, value);
    return true;
  }
});

let requestId: number; //next animation frame

let board: Board = new Board(ctx, ctxNext, account);

const moves = {
  ...BASIC_MOVES,
  [KEY.UP]: p => board.rotate(p)
};

function repaintCanvasText(canvasTextParams: canvasTextParamsInterface): void {
  const { text, textPositionX, textPositionY, textColorFill } = canvasTextParams;

  ctx.fillStyle = 'black';
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = '1px Arial';
  ctx.fillStyle = textColorFill;
  ctx.fillText(text, textPositionX, textPositionY);
}

function gameOver(): void {
  cancelAnimationFrame(requestId);
  repaintCanvasText({ text: CANVAS_TEXT.OVER, textPositionX: 1.8, textPositionY: 4, textColorFill: 'red' });
}

function pause(): void {
  if (!requestId) {
    animate();
    return;
  }

  cancelAnimationFrame(requestId);
  requestId = null;

  repaintCanvasText({ text: CANVAS_TEXT.PAUSED, textPositionX: 3, textPositionY: 4, textColorFill: 'yellow' });
}

function animate(now: number = 0): void {
  time.elapsed = now - time.start;
  if (time.elapsed > time.level) {
    time.start = now;
    const dropNewPiece = board.drop();

    if (!dropNewPiece) {
      gameOver();
      return;
    }
  }

  // Clear board before drawing new state.
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  board.draw();
  requestId = requestAnimationFrame(animate);
}

function resetGame(): void {
  account.score = 0;
  account.lines = 0;
  account.level = 0;
  time = { start: 0, elapsed: 0, level: LEVEL[account.level] };
  board.reset(time);
}

function play(): void {
  resetGame();
  time.start = performance.now();
  // If we have an old game running a game then cancel the old
  if (requestId) cancelAnimationFrame(requestId);
  animate();
}

function keyDownEventListener(event) {
  const { keyCode } = event, validGameKey = moves[keyCode];

  if (keyCode === KEY.P) pause();

  if (keyCode === KEY.ESC) {
    gameOver();
  } else if (board.piece && validGameKey) {
    event.preventDefault();

    // Get new state - dispatch key "move"
    let pieceNewState = validGameKey(board.piece);

    if (keyCode === KEY.SPACE) {   // Hard drop
      while (board.valid(pieceNewState)) {
        account.score += POINTS.HARD_DROP;
        board.piece.move(pieceNewState);
        pieceNewState = moves[KEY.DOWN](board.piece);
      }
    } else if (board.valid(pieceNewState)) { // Soft drop
      board.piece.move(pieceNewState);
      if (keyCode === KEY.DOWN) account.score += POINTS.SOFT_DROP;
    }
  }
}

function addEventListeners(): void {
  document.addEventListener('keydown', keyDownEventListener);
  document.querySelector('#play').addEventListener('click', play);
}

function initNext(): void {
  const nextSizeMultiplier = 4;

  ctxNext.canvas.width = nextSizeMultiplier * BLOCK_SIZE;
  ctxNext.canvas.height = nextSizeMultiplier * BLOCK_SIZE;
  ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
}

function startGame(): void {
  initNext();
  addEventListeners();
}

startGame();
