import {Ship} from '../ship/ship';

export class Fleet {
  ships: Ship[];
  disabledCells: {} = {};
  shipReadyCount: number = 0;
  fleetIsReady: boolean = false;

  constructor(ships: Ship[]) {
    this.ships = ships;
  }

  checkForFreePlace(ship: Ship): boolean {
    let ownCells = ship.getShipOwnCoords();
    let response: boolean = true;
    let BreakException: {} = {};

    try {
      for (let item in this.disabledCells) {
        ownCells.forEach((ownItem: any) => {
          this.disabledCells[item].forEach((disItem: any) => {
            if (ownItem.x == disItem.x && ownItem.y == disItem.y) {
              response = false;
              throw BreakException;
            }
          });
        });
      }
    } catch (e) {
      if (e !== BreakException) throw e;
    }

    return response;
  }

  addDisabledCells(ship: Ship) {
    this.disabledCells[ship.id] = ship.getShipPrivateSquare();
  }

  removeDisabledCells(ship: Ship) {
    delete this.disabledCells[ship.id];
  }

  checkShipsReady() {
    let a: number = 0;
    this.ships.forEach((item) => {
      if(item.shipIsReady) {
        a += 1;
      }
    });
    this.fleetIsReady = (a > 9);
  }
}
