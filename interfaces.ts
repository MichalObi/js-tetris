export interface MoveInterface {
  x: number,
  y: number,
  shape
}

export interface PieceInterface {
  x: number,
  y: number,
  typeId: number,
  ctx: CanvasRenderingContext2D,
  color,
  shape,
  spawn(),
  draw(),
  move(p: MoveInterface),
  setStartingPosition(),
  randomizeTetrominoType(noOfTypes: number): number
}
