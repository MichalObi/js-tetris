import { Piece } from './piece.js';
import { accountValuesInterface, timeInterface } from './interfaces.js';
import { COLS, ROWS, BLOCK_SIZE, KEY, LINES_PER_LEVEL, LEVEL, POINTS, COLORS, BASIC_MOVES } from './constants.js';

export class Board {
  public ctx: CanvasRenderingContext2D;
  public ctxNext: CanvasRenderingContext2D;
  public account: accountValuesInterface;
  public grid: number[][];
  public piece: Piece;
  public next: Piece;
  public time: timeInterface;

  constructor(ctx: CanvasRenderingContext2D, ctxNext: CanvasRenderingContext2D, account: accountValuesInterface) {
    this.ctx = ctx;
    this.ctxNext = ctxNext;
    this.account = account;
    this.init();
  }

  init(): void {
    // Calculate size of canvas from constants.
    this.ctx.canvas.width = COLS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;

    // Scale so we don't need to give size on every draw.
    this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  reset(time: timeInterface): void {
    this.time = time;
    this.grid = this.getEmptyGrid();
    this.piece = new Piece(this.ctx);
    this.piece.setStartingPosition();
    this.getNewPiece();
  }

  getNewPiece(): void {
    const { width, height } = this.ctxNext.canvas;

    this.next = new Piece(this.ctxNext);
    this.ctxNext.clearRect(0, 0, width, height);
    this.next.draw();
  }

  draw(): void {
    this.piece.draw();
    this.drawBoard();
  }

  drop(): boolean {
    let p = BASIC_MOVES[KEY.DOWN](this.piece);

    if (this.valid(p)) {
      this.piece.move(p);
    } else {
      this.freeze();
      this.clearLines();
      if (this.piece.y === 0) {
        // Game over
        return false;
      }
      this.piece = this.next;
      this.piece.ctx = this.ctx;
      this.piece.setStartingPosition();
      this.getNewPiece();
    }
    return true;
  }

  clearLines(): void {
    let lines = 0;

    this.grid.forEach((row, y) => {

      // If every value is greater than 0.
      if (row.every(value => value > 0)) {
        lines++;

        // Remove the row.
        this.grid.splice(y, 1);

        // Add zero filled row at the top.
        this.grid.unshift(Array(COLS).fill(0));
      }
    });

    if (lines > 0) {
      // Calculate points from cleared lines and level.

      this.account.score += this.getLinesClearedPoints(lines);
      this.account.lines += lines;

      // If we have reached the lines for next level
      if (this.account.lines >= LINES_PER_LEVEL) {
        // Goto next level
        this.account.level++;

        // Remove lines so we start working for the next level
        this.account.lines -= LINES_PER_LEVEL;

        // Increase speed of game
        this.time.level = LEVEL[this.account.level];
      }
    }
  }

  valid(p: Piece): boolean {
    return p.shape.every((row, dy) => {
      return row.every((value, dx) => {
        let x = p.x + dx,
          y = p.y + dy;
        return (
          value === 0 ||
          (this.insideWalls(x) && this.aboveFloor(y) && this.notOccupied(x, y))
        );
      });
    });
  }

  freeze(): void  {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.grid[y + this.piece.y][x + this.piece.x] = value;
        }
      });
    });
  }

  drawBoard(): void  {
    this.grid.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillStyle = COLORS[value];
          this.ctx.fillRect(x, y, 1, 1);
        }
      });
    });
  }

  getEmptyGrid(): number[][] {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  insideWalls(x: number): boolean {
    return x >= 0 && x < COLS;
  }

  aboveFloor(y: number): boolean {
    return y <= ROWS;
  }

  notOccupied(x: number, y: number) {
    return this.grid[y] && this.grid[y][x] === 0;
  }

  rotate(piece: Piece): Piece {
    // Clone with JSON for immutability.
    let p = JSON.parse(JSON.stringify(piece));

    // Transpose matrix
    for (let y = 0; y < p.shape.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
      }
    }

    // Reverse the order of the columns.
    p.shape.forEach(row => row.reverse());
    return p;
  }

  getLinesClearedPoints(lines: number): number {
    const lineClearPoints =
      lines === 1
        ? POINTS.SINGLE
        : lines === 2
          ? POINTS.DOUBLE
          : lines === 3
            ? POINTS.TRIPLE
            : lines === 4
              ? POINTS.TETRIS
              : 0;

    return (this.account.level + 1) * lineClearPoints;
  }
}
