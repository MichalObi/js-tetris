import { PieceInterface, MoveInterface } from './interfaces.js';
import { SHAPES, COLORS } from './constants.js';

export class Piece implements PieceInterface {
  public x: number;
  public y: number;
  public typeId: number;
  public ctx: CanvasRenderingContext2D;
  public color: string;
  public shape: number[][];

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.spawn();
  }

  spawn(): void {
    this.typeId = this.randomizeTetrominoType(COLORS.length - 1);
    this.shape = SHAPES[this.typeId];
    this.color = COLORS[this.typeId];
    this.x = 0;
    this.y = 0;
  }

  draw(): void {
    this.ctx.fillStyle = this.color;
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
      });
    });
  }

  move(p: MoveInterface) {
    this.x = p.x;
    this.y = p.y;
    this.shape = p.shape;
  }

  setStartingPosition(): void {
    this.x = this.typeId === 4 ? 4 : 3;
  }

  randomizeTetrominoType(noOfTypes: number): number {
    return Math.floor(Math.random() * noOfTypes + 1);
  }
}
