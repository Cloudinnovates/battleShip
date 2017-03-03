import {ShipCell} from './shipCell';

export class Ship {
  private length: number;
  private isHorizontal: boolean;
  private canRotate: boolean;
  id: number;
  cells: ShipCell[];
  shipIsReady: boolean = false;

  constructor(id: number, length: number, isHorizontal: boolean = true, canRotate: boolean = true) {
    this.length = length;
    this.canRotate = canRotate;
    this.id = id;
    this.isHorizontal = isHorizontal;
    this.cells = [];
    for (let i: number = 0; i < this.length; i++) {
      this.cells.push(new ShipCell(null, null));
    }
  }

  rotateShip(): void {
    this.isHorizontal = !this.isHorizontal;
  }

  disableRotate(): void {
    this.canRotate = false;
  }

  enableRotate(): void {
    if (this.length > 1) this.canRotate = true;
  }

  resetCellsCoords(): void {
    for (let i: number = 0; i < this.length; i++) {
      this.cells[i].resetCoords();
    }
  }

  getShipPrivateSquare(): Array<{x: number, y: number}> {
    let squareCells: Array<{x: number, y: number}> = [];
    let leftEnd: ShipCell = this.cells[0];

    if(this.isHorizontal) {
      for (let i = -1; i <= this.length; i++) {
        for (let j = -1; j < 2; j++) {
          squareCells.push({x : leftEnd.x + i, y: leftEnd.y + j});
        }
      }
    } else {
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j <= this.length; j++) {
          squareCells.push({x : leftEnd.x + i, y: leftEnd.y + j});
        }
      }
    }
    return squareCells;
  }

  getShipOwnCoords(): Array<{x: number, y: number}> {
    return this.cells;
  }

  addCellsCoords(x: number, y: number): void {
    if (!this.isHorizontal) {
      for (let i: number = 0; i < this.length; i++) {
        this.cells[i].setNewCoords(x, y + i);
      }
    } else {
      for (let i: number = 0; i < this.length; i++) {
        this.cells[i].setNewCoords(x + i, y);
      }
    }
  }
}
