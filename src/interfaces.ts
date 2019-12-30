export interface MoveInterface {
  x: number,
  y: number,
  shape: number[][]
}

export interface PieceInterface {
  x: number,
  y: number,
  typeId: number,
  ctx: CanvasRenderingContext2D,
  color: string,
  shape: number[][],
  spawn(),
  draw(),
  move(p: MoveInterface),
  setStartingPosition(),
  randomizeTetrominoType(noOfTypes: number): number
}

export interface BoardInterface {
  ctx: CanvasRenderingContext2D;
  ctxNext: CanvasRenderingContext2D;
  account: accountValuesInterface;
  grid: number[][];
  piece: PieceInterface;
  next: PieceInterface;
  time: timeInterface;
}

export interface accountValuesInterface {
  score: number,
  level: number,
  lines: number
}

export interface timeInterface {
  start: number,
  elapsed: number,
  level: number
}

export interface canvasTextParamsInterface {
  text: string,
  textPositionX: number,
  textPositionY: number,
  textColorFill: string
}
