export class ShipCell {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  setNewCoords(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  resetCoords(): void {
    this.x = null;
    this.y = null;
  }
}
