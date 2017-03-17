export class ShipCell {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public setNewCoords(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public resetCoords(): void {
    this.x = null;
    this.y = null;
  }
}
