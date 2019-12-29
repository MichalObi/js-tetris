import { Board } from './board.js';
import { accountValuesInterface } from './interfaces.js';
import { KEY, BLOCK_SIZE, POINTS, LEVEL, BASIC_MOVES } from './constants.js';

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

function updateAccount(key, value: string) {
  const element = document.querySelector(`#${key}`);

  if (element) element.textContent = value;
}

let account = new Proxy(accountValues, {
  set: (target, key, value: string): boolean => {
    target[key] = value;
    updateAccount(key, value);
    return true;
  }
});

let requestId: number;

let board: Board = new Board(ctx, ctxNext, account);

const moves = {
  ...BASIC_MOVES,
  [KEY.UP]: p => board.rotate(p)
};

addEventListener();

initNext();

function initNext(): void {
  // Calculate size of canvas from constants.
  ctxNext.canvas.width = 4 * BLOCK_SIZE;
  ctxNext.canvas.height = 4 * BLOCK_SIZE;
  ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
}

function addEventListener(): void {
  document.addEventListener('keydown', event => {
    if (event.keyCode === KEY.P) {
      pause();
    }
    if (event.keyCode === KEY.ESC) {
      gameOver();
    } else if (moves[event.keyCode]) {
      event.preventDefault();
      // Get new state
      let p = moves[event.keyCode](board.piece);
      if (event.keyCode === KEY.SPACE) {
        // Hard drop
        while (board.valid(p)) {
          account.score += POINTS.HARD_DROP;
          board.piece.move(p);
          p = moves[KEY.DOWN](board.piece);
        }
      } else if (board.valid(p)) {
        board.piece.move(p);
        if (event.keyCode === KEY.DOWN) {
          account.score += POINTS.SOFT_DROP;
        }
      }
    }
  });
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
  if (requestId) {
    cancelAnimationFrame(requestId);
  }

  animate();
}

function animate(now:number = 0): void {
  time.elapsed = now - time.start;
  if (time.elapsed > time.level) {
    time.start = now;
    if (!board.drop()) {
      gameOver();
      return;
    }
  }

  // Clear board before drawing new state.
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  board.draw();
  requestId = requestAnimationFrame(animate);
}

function gameOver(): void {
  cancelAnimationFrame(requestId);
  ctx.fillStyle = 'black';
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'red';
  ctx.fillText('GAME OVER', 1.8, 4);
}

function pause(): void {
  if (!requestId) {
    animate();
    return;
  }

  cancelAnimationFrame(requestId);
  requestId = null;

  ctx.fillStyle = 'black';
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'yellow';
  ctx.fillText('PAUSED', 3, 4);
}

document.querySelector('#play').addEventListener('click', play);
