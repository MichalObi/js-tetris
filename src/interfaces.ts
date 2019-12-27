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
