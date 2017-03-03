import {Component, ElementRef, Renderer} from "@angular/core";

import {Fleet} from '../fleet/fleet';

import {APIService} from '../API/api.service';

@Component ({
  moduleId: module.id,
  selector: 'battle-field',
  templateUrl: 'battle-field.component.html',
  styleUrls: ['./battle-field.component.css']
})

export class BattleField {
  private battleCoords: {top: number, left: number};
  private componentElement: ElementRef;
  private renderer: Renderer;
  private battleField: any;


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
    let fleet:Fleet = this.apiService.getFleet();
    this.drawShips(fleet);
  }

  private fireCoords(event: MouseEvent) {
    console.log(this.battleCoords);
    console.log(Math.floor((event.pageX - this.battleCoords.left)/30));
    console.log(Math.floor((event.pageY - this.battleCoords.top)/30));
  }

  private createBattleField() {
      this.battleField = document.createElement('canvas');
      let ctx = this.battleField.getContext('2d');
      this.battleField.width = 330;
      this.battleField.height = 330;
      ctx.lineWidth = 1;
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

  private drawShips(data: Fleet) {
    // let ctx = this.battleField.getContext('2d');
    // ctx.lineWidth = 1;
    // ctx.strokeStyle = "#ff2a37";
    //
    // for (let i = 0; i < data.ships.length; i++) {
    //   for (let j = 0; j < data.ships[i].cells.length; j++) {
    //     let startX: number = (data.ships[i].cells[j].x * 30) + 30;
    //     let startY: number = (data.ships[i].cells[j].y * 30) + 30;
    //     ctx.fillRect(startX,startY,30,30);
    //   }
    // }
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
