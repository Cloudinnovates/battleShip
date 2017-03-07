import {Component, ElementRef, Renderer, Input, Output, EventEmitter, OnChanges, SimpleChanges} from "@angular/core";

import {APIService} from '../API/api.service';

@Component ({
  moduleId: module.id,
  selector: 'battle-field',
  templateUrl: 'battle-field.component.html',
  styleUrls: ['./battle-field.component.css']
})

export class BattleField  implements OnChanges{
  private battleCoords: {top: number, left: number};
  private componentElement: ElementRef;
  private renderer: Renderer;
  private battleField: any;
  private userId: string = localStorage.getItem('id');
  private gameId: string = localStorage.getItem('gameId');

  @Input()
  coordsdata: Array<{x: number, y: number}>;

  @Input()
  fieldtype: string;

  constructor(componentElement: ElementRef, renderer: Renderer, private apiService: APIService) {
    this.componentElement = componentElement;
    this.renderer = renderer;
  }

  ngOnInit() {
    this.createBattleField();
    this.setBattleFieldCoords();
    this.renderer.listen(this.battleField, 'click', (event: MouseEvent)=> {
      this.fireCoords(event);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.coordsdata) {
      let newCoords = changes['coordsdata'].currentValue;
      if(newCoords && newCoords.length > 0) {
        this.drawShips(newCoords);
      }
    }
  }

  private fireCoords(event: MouseEvent) {
    if(this.fieldtype == 'user') {
      let pageX = Math.floor((event.pageX - this.battleCoords.left)/30);
      let pageY = Math.floor((event.pageY - this.battleCoords.top)/30);
      this.apiService.shoot(this.gameId, this.userId, {x : pageX, y: pageY}).then((res) => {
        console.log(res);
      })
    }
  }

  private createBattleField() {
      this.battleField = document.createElement('canvas');
      let ctx = this.battleField.getContext('2d');
      this.battleField.width = 330;
      this.battleField.height = 330;
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
      this.componentElement.nativeElement.appendChild(this.battleField);
  }

  private drawShips(coords: Array<{x: number, y: number}>) {
    let ctx = this.battleField.getContext('2d');
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#6f00ff";
    coords.forEach(function (item, key) {
      let startX: number = 30 + (item.x * 30);
      let startY: number = 30 + (item.y * 30);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX+30, startY);
      ctx.lineTo(startX+30, startY+30);
      ctx.lineTo(startX, startY+30);
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
