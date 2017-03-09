import {Component, OnInit} from '@angular/core';

import {APIService} from '../API/api.service';
import {Router} from '@angular/router';

import {Fleet} from '../fleet/fleet';
import {Ship} from '../ship/ship';
import {ShipCell} from '../ship/shipCell';

@Component({
  moduleId: module.id,
  selector: 'game-prepare',
  templateUrl: 'game-prepare.component.html',
  styleUrls: ['./game-prepare.component.css']
})

export class GamePrepareComponent {
  private battleCoords: {top: number, left: number};
  private battleWidth: number = 300;
  private battleHeight: number = 300;
  private step: number = 30;
  private overField: boolean;
  private userId: string = localStorage.getItem('id');
  private gameId: string = localStorage.getItem('gameId');
  private shipType: {width: number, height: number} = {width: null, height: null};
  fleet: Fleet;

  constructor(private apiService: APIService, private router : Router) {}

  ngOnInit(): void {
    this.fleet = new Fleet([
      new Ship(1, 4),
      new Ship(2, 3),
      new Ship(3, 3),
      new Ship(4, 2, false),
      new Ship(5, 2, false),
      new Ship(6, 2, false),
      new Ship(7, 1, true, false),
      new Ship(8, 1, true, false),
      new Ship(9, 1, true, false),
      new Ship(10, 1, true, false),
    ]);
    this.createBattleField('userGamePanel');
    this.setBattleFieldCoords();
  }

  private addDragEvent(event: MouseEvent, shipObject: Ship): void {
    this.resetDragParams(shipObject);
    let ship: HTMLElement = event.toElement.parentElement;
    let coords = this.getCoords(ship);
    let deltaX: number = event.pageX - coords.left;
    let deltaY: number = event.pageY - coords.top;
    this.shipType.width = ship.offsetWidth / this.step;
    this.shipType.height = ship.offsetHeight / this.step;

    let handlerMove = (event: MouseEvent) => {
      ship.style.position = 'fixed';
      ship.style.top = event.pageY - deltaY + 'px';
      ship.style.left = event.pageX - deltaX + 'px';
      this.checkShipOverField(event.pageY - deltaY, event.pageX - deltaX);
    };

    let handlerUp = (event: MouseEvent) => {
      let closestCells: number[] = this.getClosestCell(event.pageY - deltaY, event.pageX - deltaX);
      shipObject.addCellsCoords(closestCells[0], closestCells[1]);
      if (this.overField && this.fleet.checkForFreePlace(shipObject)) {
        let newCoords: {top: number, left: number} = this.placeShipToField(event.pageY - deltaY, event.pageX - deltaX);
        ship.style.top = newCoords.top + 'px';
        ship.style.left = newCoords.left + 'px';
        this.fleet.addDisabledCells(shipObject);
        shipObject.disableRotate();
        shipObject.shipIsReady = true;
      } else {
        ship.style.removeProperty('position');
        ship.style.removeProperty('left');
        ship.style.removeProperty('top');
        this.fleet.removeDisabledCells(shipObject);
        shipObject.enableRotate();
        shipObject.resetCellsCoords();
        shipObject.shipIsReady = false;
      }
      this.fleet.checkShipsReady();
      document.removeEventListener('mousemove', handlerMove);
      document.removeEventListener('mouseup', handlerUp);
    };

    document.addEventListener('mousemove', handlerMove);
    document.addEventListener('mouseup', handlerUp)
  }

  private resetDragParams(shipObject: Ship): void {
    this.overField = false;
    this.fleet.removeDisabledCells(shipObject);
  }

  private rotateShip(shipObject: Ship): void {
    shipObject.rotateShip();
  }

  private placeShipToField(top: number, left: number): {top: number, left: number} {
    let a: number[] = this.getClosestCell(top, left);
    let closestStepsLeft: number = a[0];
    let closestStepsTop: number = a[1];
    return {
      top: this.battleCoords.top + (closestStepsTop * this.step),
      left: this.battleCoords.left + (closestStepsLeft * this.step)
    }
  }

  private getClosestCell(top: number, left: number): number[] {
    let a: number = Math.round((left - this.battleCoords.left) / 30);
    let b: number = Math.round((top - this.battleCoords.top) / 30);
    if (a + this.shipType.width > 9) {
      a = 10 - this.shipType.width;
    }
    if (b + this.shipType.height > 9) {
      b = 10 - this.shipType.height;
    }
    return [a, b];
  }

  private checkShipOverField(top: number, left: number): void {
    this.overField = (top > this.battleCoords.top && left > this.battleCoords.left && top < this.battleCoords.top + this.battleHeight && left < this.battleCoords.left + this.battleWidth);
  }

  private createBattleField(wrapperId: string) {
    let element = document.getElementById(wrapperId);
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = 330;
    canvas.height = 330;
    ctx.lineWidth = 0.4;
    ctx.strokeStyle = "#6f00ff";
    for (let i = 1; i <= 11; i++) {
      ctx.beginPath();
      ctx.moveTo(30 * i, 30);
      ctx.lineTo(30 * i, 330);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(30, 30 * i);
      ctx.lineTo(330, 30 * i);
      ctx.stroke();
    }
    element.appendChild(canvas);
  }

  private setBattleFieldCoords(): void {
    this.battleCoords = this.getCoords(document.getElementById('userGamePanel'));
    this.battleCoords.left = this.battleCoords.left + 30;
    this.battleCoords.top = this.battleCoords.top + 30;
  }

  private getCoords(elem: HTMLElement): {top: number, left: number} {
    let box = elem.getBoundingClientRect();
    let body = document.body;
    let docEl = document.documentElement;
    let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    let clientTop = docEl.clientTop || body.clientTop || 0;
    let clientLeft = docEl.clientLeft || body.clientLeft || 0;
    let top = box.top + scrollTop - clientTop;
    let left = box.left + scrollLeft - clientLeft;
    return {top: Math.round(top), left: Math.round(left)};
  }

  private submitGame(): void {
    if (this.fleet.fleetIsReady) {
      let shipsCoords: ShipCell[] = [];
      this.fleet.ships.forEach(function(item) {
        shipsCoords = shipsCoords.concat(item.cells);
      });
      this.apiService.setFleet(this.gameId, this.userId, shipsCoords).then((res) => {
        this.apiService.setUserStatus(this.userId, 'readyToPlay').then( (res) => {
          this.router.navigate(['game']);
        });
      });
    }
  }
}
