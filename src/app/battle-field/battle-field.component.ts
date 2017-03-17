import {
  Component,
  ElementRef,
  Renderer,
  Input,
  Output,
  AfterViewInit,
  EventEmitter,
  DoCheck
} from "@angular/core";

import {FieldCoords} from '../models/FieldCoords';

@Component({
  moduleId: module.id,
  selector: 'battle-field',
  templateUrl: 'battle-field.component.html',
  styleUrls: ['./battle-field.component.css']
})

export class BattleField implements DoCheck, AfterViewInit {
  private componentElement: ElementRef;
  private renderer: Renderer;
  private battleField: any = null;
  private battleCoordsCanvas: any = null;
  private battleCoords: {top: number, left: number};
  private data: FieldCoords;
  private oldData: FieldCoords = this.data;

  @Input() coordsdata: FieldCoords;
  @Input() firePanel: boolean;

  @Output() onShoot = new EventEmitter<{}>();

  constructor(componentElement: ElementRef, renderer: Renderer) {
    this.componentElement = componentElement;
    this.renderer = renderer;
  }

  ngOnInit() {
    this.createBattleField();
    this.renderer.listen(this.battleField, 'click', (event: MouseEvent) => {
      this.fireCoords(event);
    });
    this.data = this.coordsdata;
  }

  ngAfterViewInit() {
    this.setBattleFieldCoords();
  }

  ngDoCheck() {
    this.oldData = this.data;
    this.data = this.coordsdata;
    if (this.oldData === this.data) {
      if (this.battleField) {
        this.drawBattle();
      }
    }
  }

  private drawBattle() {
    let ctx = this.battleCoordsCanvas.getContext('2d');
    ctx.clearRect(0, 0, this.battleCoordsCanvas.width, this.battleCoordsCanvas.height);
    if (this.data.shipCoords && this.data.shipCoords.length > 0) {
      this.drawShips(this.data.shipCoords);
    }
    if (this.data.passCoords && this.data.passCoords.length > 0) {
      this.data.passCoords.forEach((item: any) => {
        this.drawPass(item);
      });
    }
    if (this.data.hitCoords && this.data.hitCoords.length > 0) {
      this.data.hitCoords.forEach((item: any) => {
        this.drawHit(item);
      });
    }
  }

  private fireCoords(event: MouseEvent) {
    if (this.firePanel) {
      let pageX = Math.floor((event.pageX - this.battleCoords.left) / 30);
      let pageY = Math.floor((event.pageY - this.battleCoords.top) / 30);
      this.onShoot.emit({x: pageX, y: pageY});
    }
  }

  private drawPass(coords: {x: number, y: number}): void {
    let ctx = this.battleCoordsCanvas.getContext('2d');
    let startX: number = 43 + (coords.x * 30);
    let startY: number = 43 + (coords.y * 30);
    ctx.fillRect(startX, startY, 6, 6);
  }

  private drawHit(coords: {x: number, y: number}): void {
    let ctx = this.battleCoordsCanvas.getContext('2d');
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#ef2b2b";
    let startX: number = 30 + (coords.x * 30);
    let startY: number = 30 + (coords.y * 30);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + 30, startY + 30);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(startX + 30, startY);
    ctx.lineTo(startX, startY + 30);
    ctx.stroke();
  }

  private createBattleField() {
    this.battleField = document.createElement('canvas');
    this.battleCoordsCanvas = document.createElement('canvas');
    this.battleCoordsCanvas.classList.add('coords-canvas');
    let ctx = this.battleField.getContext('2d');
    this.battleField.width = 330;
    this.battleCoordsCanvas.width = 330;
    this.battleField.height = 330;
    this.battleCoordsCanvas.height = 330;
    ctx.lineWidth = .3;
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
    this.componentElement.nativeElement.querySelector('.game-field').appendChild(this.battleField);
    this.componentElement.nativeElement.querySelector('.game-field').appendChild(this.battleCoordsCanvas);
  }

  private drawShips(coords: Array<{x: number, y: number}>) {
    let ctx = this.battleCoordsCanvas.getContext('2d');
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#6f00ff";
    coords.forEach(function (item, key) {
      let startX: number = 30 + (item.x * 30);
      let startY: number = 30 + (item.y * 30);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + 30, startY);
      ctx.lineTo(startX + 30, startY + 30);
      ctx.lineTo(startX, startY + 30);
      ctx.lineTo(startX, startY);
      ctx.stroke();
    });
  }

  private setBattleFieldCoords(): void {
    this.battleCoords = this.getCoords(this.battleField);
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
}
